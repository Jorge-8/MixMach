from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .utils import token_generator
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from .serializers import IngredientSerializer
from .models import Ingredient
from rest_framework import generics, permissions
from .serializers import CocktailSerializer
from .models import Cocktail

# validacion del correo
import random
import string
from django.core.cache import cache
from .utils import send_verification_email


User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        # Validar datos SIN guardar todavía
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            # Generar código de 6 dígitos
            verification_code = ''.join(random.choices(string.digits, k=6))
            
            # Guardar código en caché por 10 minutos
            cache_key = f"verify_{request.data['email']}"
            cache.set(cache_key, {
                'code': verification_code,
                'data': serializer.validated_data
            }, timeout=600)

            # Intentar enviar email
            try:
                send_verification_email(request.data['email'], verification_code)
                return Response(
                    {"message": "Código enviado a tu correo"},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                # Si falla el email, eliminar código
                cache.delete(cache_key)
                return Response(
                    {"error": "Error al enviar email. Intenta de nuevo."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Si el serializer no es válido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response(
                {"error": "Email y código son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Obtener código del caché
        cache_key = f"verify_{email}"
        stored_data = cache.get(cache_key)

        if not stored_data:
            return Response(
                {"error": "Código expirado. Intenta registrarte de nuevo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if stored_data['code'] != code:
            return Response(
                {"error": "Código incorrecto"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # El código es correcto, ahora SÍ guardar el usuario
        try:
            user = User.objects.create_user(
                username=stored_data['data']['email'],
                email=stored_data['data']['email'],
                first_name=stored_data['data']['first_name'],
                password=stored_data['data']['password'],
                is_active=True
            )
            
            # Eliminar código del caché
            cache.delete(cache_key)

            return Response(
                {"message": "Cuenta verificada correctamente"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            user = authenticate(username=user.username, password=password)

        except User.DoesNotExist:
            user = None

        if user is None:
            return Response(
                {"error": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "Cuenta no verificada"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        data = {
            "message": "Login exitoso",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.first_name
            }
        }

        response = Response(data)
        # Set cookie para que el frontend (y middleware) pueda leerlo en peticiones siguientes
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            samesite='Lax',
            secure=not settings.DEBUG,
            path='/'
        )

        return response

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
        })

# Ingredientes

class IngredientListView(generics.ListAPIView):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer
    permission_classes = [permissions.AllowAny]

class PlatformCocktailListView(generics.ListAPIView):
    queryset = Cocktail.objects.filter(user__isnull=True).order_by('-created_at')
    serializer_class = CocktailSerializer
    permission_classes = [permissions.AllowAny]