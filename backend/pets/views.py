from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import (
    Pet,
    LostFoundReport,
    LostFoundImage,
    Favorite,
    AdoptionRequest,
    LostFoundResponse,
)

from .serializers import (
    PetCreateSerializer,
    PetListSerializer,
    LostFoundReportSerializer,
    AdoptionRequestCreateSerializer,
    AdoptionRequestDetailSerializer,
    LostFoundResponseSerializer,      
    LostFoundResponseDetailSerializer,
)

from notifications.models import Notification
from notifications.services import send_notification
from notifications.gmail_service import send_email

from pets.utils.geocode import geocode_address

User = get_user_model()


class CreateAdoptionPetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PetCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            pet = serializer.save()

            lat, lng = geocode_address(pet.location)
            pet.lat = lat
            pet.lng = lng
            pet.save()

            return Response(
                {"message": "Pet registered successfully", "pet_id": pet.id},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListAdoptablePetsView(APIView):
    def get(self, request):
        pets = Pet.objects.filter(is_active=True).order_by("-created_at")
        serializer = PetListSerializer(pets, many=True)
        return Response(serializer.data)


class PetDetailView(RetrieveAPIView):
    queryset = Pet.objects.filter(is_active=True)
    serializer_class = PetListSerializer
    permission_classes = [AllowAny]

class CreateAdoptionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pet_id):
        pet = get_object_or_404(Pet, id=pet_id)

        # Prevent owners from creating adoption requests for their own pets
        if pet.owner_id == request.user.id:
            return Response(
                {"error": "You cannot create an adoption request for your own pet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AdoptionRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        adoption_request = AdoptionRequest.objects.create(
            pet=pet,
            requester=request.user,
            phone=serializer.validated_data["phone"],
            message=serializer.validated_data.get("message", "")
            )

        send_notification(
            user=pet.owner,
            title="New Adoption Request",
            message=(
                f"{request.user.username} wants to adopt {pet.name}.\n"
                f"Phone: {adoption_request.phone}"
            )
        )

        try:
            send_email(
                to_email=pet.owner.email,
                subject="New Adoption Request",
                message=(
                    f"You received a new adoption request for {pet.name}.\n\n"
                    f"From: {request.user.username}\n"
                    f"Email: {request.user.email}\n"
                    f"Phone: {adoption_request.phone}\n\n"
                    f"Message:\n{adoption_request.message}"
                )
            )
        except Exception as e:
            print("Email failed:", e)

        return Response(
            {"message": "Adoption request sent successfully"},
            status=status.HTTP_201_CREATED
        )

class OwnerAdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = AdoptionRequest.objects.filter(
            pet__owner=request.user
        ).order_by("-created_at")

        serializer = AdoptionRequestDetailSerializer(requests, many=True)
        return Response(serializer.data)


class UpdateAdoptionRequestStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, request_id):
        adoption_request = get_object_or_404(
            AdoptionRequest,
            id=request_id,
            pet__owner=request.user
        )

        status_value = request.data.get("status")
        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)
        
        if status_value == "rejected":
            send_notification(
                user=adoption_request.requester,
                title="Adoption Request Rejected",
                message=f"Your adoption request for {adoption_request.pet.name} was rejected."
            )
            
            try:
                send_email(
                    to_email=adoption_request.requester.email,
                    subject="Adoption Request Rejected",
                    message=(
                        f"Your adoption request for {adoption_request.pet.name} "
                        f"has been rejected by the owner."
                    )
                )
            
            except Exception as e:
                print("Email failed:", e)

            adoption_request.delete()
            
            return Response(
                {"message": "Adoption request rejected and removed"},
                status=status.HTTP_200_OK
            )

class CreateLostFoundReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        # Remove image fields from serializer payload; images are handled via request.FILES
        data.pop("images", None)

        serializer = LostFoundReportSerializer(data=data)

        if not serializer.is_valid():
            # Log errors to server console for easier debugging
            print("LostFoundReport validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        report = serializer.save(user=request.user)

        lat, lng = geocode_address(report.location_found)
        report.lat = lat
        report.lng = lng
        report.save()

        for file in request.FILES.values():
            LostFoundImage.objects.create(report=report, image=file)

        return Response(
            {"message": "Report submitted for verification"},
            status=status.HTTP_201_CREATED
        )

class ActiveReportsView(APIView):
    def get(self, request):
        reports = LostFoundReport.objects.filter(status="active")
        serializer = LostFoundReportSerializer(reports, many=True)
        return Response(serializer.data)

class LostFoundDetailView(RetrieveAPIView):
    queryset = LostFoundReport.objects.filter(status="active")
    serializer_class = LostFoundReportSerializer

class AdminReportsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reports = LostFoundReport.objects.all().order_by("-created_at")
        serializer = LostFoundReportSerializer(reports, many=True)
        return Response(serializer.data)

class UpdateReportStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, report_id):
        report = get_object_or_404(LostFoundReport, id=report_id)
        new_status = request.data.get("status")

        report.status = new_status
        report.save()

        Notification.objects.create(
            user=report.user,
            title="Report Status Updated",
            message=f"Your report is now {new_status.upper()}."
        )

        try:
            send_email(
                to_email=report.user.email,
                subject="Lost/Found Report Update",
                message=f"Your report status is now {new_status.upper()}."
            )
        except Exception as e:
            print("Email failed:", e)

        return Response({"message": "Status updated"})

class UserPetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if request.user.id != user_id:
            return Response({"detail": "Not allowed"}, status=403)

        pets = Pet.objects.filter(owner=request.user)
        serializer = PetListSerializer(pets, many=True)
        return Response(serializer.data)

class UserReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if request.user.id != user_id:
            return Response({"detail": "Not allowed"}, status=403)

        reports = LostFoundReport.objects.filter(user=request.user)
        serializer = LostFoundReportSerializer(reports, many=True)
        return Response(serializer.data)


class DeletePetView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pet_id):
        pet = get_object_or_404(Pet, id=pet_id)

        if pet.owner != request.user:
            return Response(
                {"detail": "Not authorized to delete this pet"},
                status=status.HTTP_403_FORBIDDEN
            )

        pet.delete()
        return Response(
            {"detail": "Pet deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

class FavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        pets = [f.pet for f in favorites]
        return Response(PetListSerializer(pets, many=True).data)

    def post(self, request):
        pet = get_object_or_404(Pet, id=request.data.get("pet_id"))

        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            pet=pet
        )

        if not created:
            favorite.delete()
            return Response({"message": "Removed from favorites"})

        return Response({"message": "Added to favorites"})

class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "total_pets": Pet.objects.count(),
            "active_pets": Pet.objects.filter(is_active=True).count(),
            "total_reports": LostFoundReport.objects.count(),
            "pending_reports": LostFoundReport.objects.filter(status="pending").count(),
            "active_reports": LostFoundReport.objects.filter(status="active").count(),
            "total_users": User.objects.count(),
        })


class UpdatePetView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pet_id):
        pet = get_object_or_404(Pet, id=pet_id, owner=request.user)

        serializer = PetCreateSerializer(
            pet,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Pet updated successfully"})

        return Response(serializer.errors, status=400)

import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class DistanceMatrixView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        origin = request.data.get("origin")
        destinations = request.data.get("destinations", [])

        if not origin or not destinations:
            return Response({}, status=400)

        results = {}

        BATCH_SIZE = 25
        for i in range(0, len(destinations), BATCH_SIZE):
            batch = destinations[i:i + BATCH_SIZE]

            dest_str = "|".join(
                f"{d['lat']},{d['lng']}" for d in batch
            )

            url = "https://maps.googleapis.com/maps/api/distancematrix/json"
            params = {
                "origins": origin,
                "destinations": dest_str,
                "key": settings.GOOGLE_MAPS_API_KEY,
            }

            res = requests.get(url, params=params).json()

            for idx, el in enumerate(res["rows"][0]["elements"]):
                if el["status"] == "OK":
                    pet_id = batch[idx]["id"]
                    results[pet_id] = {
                        "distance": el["distance"]["text"],
                        "duration": el["duration"]["text"],
                    }

        return Response(results)

class CreateLostFoundResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, report_id):
        report = get_object_or_404(LostFoundReport, id=report_id)

        serializer = LostFoundResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = serializer.save(
            report=report,
            responder=request.user
        )

        send_notification(
            user=report.user,
            title="New Lost & Found Response",
            message="Someone responded to your lost/found report."
        )

        try:
            send_email(
                to_email=report.user.email,
                subject="New Response to Your Pet Report",
                message=f"""
A user has responded to your report.

Phone: {response.phone}
Message: {response.message}
"""
            )
        except Exception as e:
            print("Email failed:", e)

        return Response(
            {"message": "Response sent successfully"},
            status=status.HTTP_201_CREATED
        )

class OwnerLostFoundResponsesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        responses = LostFoundResponse.objects.filter(
            report__user=request.user
        ).order_by("-created_at")

        serializer = LostFoundResponseDetailSerializer(responses, many=True)
        return Response(serializer.data)

class UpdateLostFoundResponseStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, response_id):
        response = get_object_or_404(
            LostFoundResponse,
            id=response_id,
            report__user=request.user
        )

        status_value = request.data.get("status")

        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        if status_value == "rejected":
            send_notification(
                user=response.responder,
                title="Response Rejected",
                message="Your response to a lost/found report was rejected."
            )

            try:
                send_email(
                    to_email=response.responder.email,
                    subject="Lost & Found Response Rejected",
                    message="Your response to the lost/found report was rejected."
                )
            except Exception as e:
                print("Email failed:", e)

            response.delete()

            return Response(
                {"message": "Response rejected and removed"},
                status=status.HTTP_200_OK
            )

        response.status = "approved"
        response.save()

        return Response({"message": "Response approved"})


class MarkReportReunitedView(APIView):
    """
    Allow report owner to mark their matched report as reunited,
    which deactivates both the lost and found reports.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, report_id):
        report = get_object_or_404(LostFoundReport, id=report_id, user=request.user)

        if report.match_status != "matched":
            return Response(
                {"error": "This report is not matched yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark as reunited
        report.match_status = "reunited"
        report.status = "inactive"
        report.save(update_fields=["match_status", "status"])

        # Also deactivate the matched report if it exists
        if report.matched_report:
            matched = report.matched_report
            matched.match_status = "reunited"
            matched.status = "inactive"
            matched.save(update_fields=["match_status", "status"])

        send_notification(
            user=request.user,
            title="🎉 Pet Reunited!",
            message=f"Your {report.report_type} report has been marked as reunited. Thank you for using PetRescue!",
        )

        return Response(
            {"message": "Report marked as reunited. Both reports have been deactivated."},
            status=status.HTTP_200_OK,
        )
