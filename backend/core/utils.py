from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings

token_generator = PasswordResetTokenGenerator()

from django.core.mail import send_mail

def send_verification_email(to_email, verification_code):
    try:
        send_mail(
            subject='Tu código de verificación - MixMatch',
            message=f'Tu código de verificación es: {verification_code}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )

        print(f"Correo enviado a {to_email}")
        return True

    except Exception as e:
        print(f"Error sending email: {e}")
        return False