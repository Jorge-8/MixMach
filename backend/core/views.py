from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer
from .utils import token_generator

User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)

            link = f"http://127.0.0.1:8000/api/verify/{uid}/{token}/"

            send_mail(
                'Verifica tu cuenta',
                f'Haz clic para verificar: {link}',
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )

            return Response(
                {"message": "Usuario creado. Revisa tu correo."},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except:
            return Response({"error": "Link inválido"}, status=400)

        if token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Cuenta verificada correctamente"})

        return Response({"error": "Token inválido"}, status=400)