import base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from .gmail_auth import get_gmail_credentials

def send_email(to_email, subject, message):
    creds = get_gmail_credentials()
    service = build("gmail", "v1", credentials=creds)

    msg = MIMEText(message)
    msg["to"] = to_email
    msg["subject"] = subject

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()

    service.users().messages().send(
        userId="me",
        body={"raw": raw}
    ).execute()
