from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_templated_email(
    *,
    to_email: str,
    subject: str,
    template_name: str,
    context: dict,
    plain_message: str | None = None,
) -> None:
    """
    Sends an HTML email (with optional plain-text fallback) using Django's SMTP backend.
    """

    html_content = render_to_string(template_name, context)
    text_content = plain_message or render_to_string(
        template_name, {**context, "as_text": True}
    )

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=True)

