from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from notifications.smtp_email import send_templated_email

User = get_user_model()


@receiver(post_save, sender=User)
def send_welcome_email_on_signup(sender, instance: User, created: bool, **kwargs):
    """
    Send a welcome email only when a new user account is created.
    """

    if not created:
        return

    if not instance.email:
        return

    context = {
        "user_name": instance.get_full_name() or instance.username,
        "support_email": getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL),
    }

    plain_message = (
        f"Hi {context['user_name']},\n\n"
        "Welcome to PetRescue!\n\n"
        "You can:\n"
        "- Report lost pets\n"
        "- Report found pets\n"
        "- Browse and adopt pets\n"
        "- Track your reports and favorites in your dashboard\n\n"
        f"If you need help, contact us at {context['support_email']}.\n\n"
        "— The PetRescue Team"
    )

    send_templated_email(
        to_email=instance.email,
        subject="Welcome to PetRescue 🐶🐱",
        template_name="emails/welcome.html",
        context=context,
        plain_message=plain_message,
    )

