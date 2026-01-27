from django.utils import timezone
from django.db import transaction
from django.db.models import Q, Max

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from pets.models import LostFoundReport, LostFoundImage
from notifications.services import send_notification
from notifications.smtp_email import send_templated_email

from .models import PetMatch
from .serializers import PetMatchSerializer
from .services import match_pet_images


class RunAIMatchView(APIView):
    """
    Admin endpoint to run AI image matching for pending lost vs pending found reports.
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
        # Match active lost reports with active found reports that have at least one image
        lost_reports = (
            LostFoundReport.objects.filter(
                report_type="lost",
                status="active",
            )
            .filter(images__isnull=False)
            .distinct()
        )

        found_reports = (
            LostFoundReport.objects.filter(
                report_type="found",
                status="active",
            )
            .filter(images__isnull=False)
            .distinct()
        )

        created_or_updated_matches: list[PetMatch] = []

        with transaction.atomic():
            for lost in lost_reports:
                lost_image = lost.images.first()
                if not isinstance(lost_image, LostFoundImage):
                    continue

                for found in found_reports:
                    found_image = found.images.first()
                    if not isinstance(found_image, LostFoundImage):
                        continue

                    score, is_match = match_pet_images(
                        lost_image.image.path,
                        found_image.image.path,
                    )

                    if score <= 0:
                        continue

                    pet_match, _ = PetMatch.objects.update_or_create(
                        lost_report=lost,
                        found_report=found,
                        defaults={
                            "score": score,
                            "matched_on": timezone.now(),
                        },
                    )
                    created_or_updated_matches.append(pet_match)

                    # Track best score on each report for quick reference
                    for report in (lost, found):
                        if report.match_score is None or score > report.match_score:
                            report.match_score = score
                            report.save(update_fields=["match_score"])

        # Return matches sorted by score
        matches_qs = (
            PetMatch.objects.filter(
                Q(pk__in=[m.pk for m in created_or_updated_matches])
            ).order_by("-score", "-matched_on")
        )

        return Response(PetMatchSerializer(matches_qs, many=True).data)


class ListMatchesView(APIView):
    """
    Admin endpoint to list all AI-generated matches, sorted by score.
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        matches = PetMatch.objects.all().order_by("-score", "-matched_on")
        serializer = PetMatchSerializer(matches, many=True)
        return Response(serializer.data)


class ConfirmMatchView(APIView):
    """
    Admin endpoint to confirm a PetMatch and trigger notifications/emails.
    """

    permission_classes = [IsAdminUser]

    def post(self, request, match_id: int):
        try:
            pet_match = PetMatch.objects.select_related(
                "lost_report__user", "found_report__user"
            ).get(pk=match_id)
        except PetMatch.DoesNotExist:
            return Response(
                {"detail": "Match not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        lost = pet_match.lost_report
        found = pet_match.found_report

        pet_match.admin_verified = True
        pet_match.save(update_fields=["admin_verified"])

        # Update linked reports
        lost.match_status = "matched"
        found.match_status = "matched"
        lost.matched_report = found
        found.matched_report = lost
        lost.match_score = pet_match.score
        found.match_score = pet_match.score
        lost.save(
            update_fields=[
                "match_status",
                "matched_report",
                "match_score",
            ]
        )
        found.save(
            update_fields=[
                "match_status",
                "matched_report",
                "match_score",
            ]
        )

        return Response(
            {"detail": "Match confirmed and reports updated."},
            status=status.HTTP_200_OK,
        )


class NotifyMatchView(APIView):
    """
    Admin endpoint to send detailed notification to lost pet owner with finder's contact info.
    """

    permission_classes = [IsAdminUser]

    def post(self, request, match_id: int):
        try:
            pet_match = PetMatch.objects.select_related(
                "lost_report__user", "found_report__user"
            ).get(pk=match_id)
        except PetMatch.DoesNotExist:
            return Response(
                {"detail": "Match not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not pet_match.admin_verified:
            return Response(
                {"detail": "Match must be verified before notifying."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lost = pet_match.lost_report
        found = pet_match.found_report

        # Build detailed notification message with finder's contact info
        finder = found.user
        notification_message = (
            f"🎉 Great news! A match has been confirmed for your lost pet '{lost.pet_name or 'pet'}'.\n\n"
            f"📋 Match Details:\n"
            f"• Similarity Score: {pet_match.score:.2%}\n"
            f"• Found Location: {found.location_found}\n\n"
            f"👤 Finder Contact Information:\n"
            f"• Name: {finder.get_full_name() or finder.username}\n"
            f"• Email: {finder.email}\n"
            f"• Phone: {finder.phone or 'Not provided'}\n\n"
            f"Please contact the finder to arrange reunion. Thank you!"
        )

        send_notification(
            user=lost.user,
            title="🐾 Your Pet Has Been Found!",
            message=notification_message,
        )

        # Send detailed email
        if lost.user.email:
            context = {
                "user_name": lost.user.get_full_name() or lost.user.username,
                "pet_name": lost.pet_name or "your pet",
                "lost_location": lost.location_found,
                "found_location": found.location_found,
                "score": pet_match.score,
                "finder_name": finder.get_full_name() or finder.username,
                "finder_email": finder.email,
                "finder_phone": finder.phone or "Not provided",
            }

            plain_message = (
                f"Hi {context['user_name']},\n\n"
                "🎉 Great news! A match has been confirmed for your lost pet.\n\n"
                f"Pet: {context['pet_name']}\n"
                f"Lost Location: {context['lost_location']}\n"
                f"Found Location: {context['found_location']}\n"
                f"Similarity Score: {context['score']:.2%}\n\n"
                "👤 Finder Contact Information:\n"
                f"Name: {context['finder_name']}\n"
                f"Email: {context['finder_email']}\n"
                f"Phone: {context['finder_phone']}\n\n"
                "Please contact the finder to arrange reunion.\n\n"
                "— The PetRescue Team"
            )

            send_templated_email(
                to_email=lost.user.email,
                subject="🐾 Your Pet Has Been Found! Contact Details Inside",
                template_name="emails/match_found.html",
                context=context,
                plain_message=plain_message,
            )

        pet_match.notified = True
        pet_match.save(update_fields=["notified"])

        return Response(
            {"detail": "Notification sent successfully with finder's contact details."},
            status=status.HTTP_200_OK,
        )

