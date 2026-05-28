from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, generics, permissions

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.core.cache import cache

from .models import Ingredient, Cocktail, BeverageCategory, Favorite, CocktailIngredient, SearchHistory
from .serializers import RegisterSerializer, IngredientSerializer, CocktailSerializer, BeverageCategorySerializer, FavoriteSerializer, UserCocktailSerializer, SearchHistorySerializer

from .utils import send_verification_email

from django.utils import timezone
from datetime import timedelta

import random
import string

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
    queryset = Cocktail.objects.all().order_by('-created_at')
    serializer_class = CocktailSerializer
    permission_classes = [permissions.AllowAny]

class BeverageCategoryListView(generics.ListAPIView):
    queryset = BeverageCategory.objects.all().order_by('id')
    serializer_class = BeverageCategorySerializer
    permission_classes = [permissions.AllowAny]


class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('cocktail')
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            cocktail = serializer.validated_data['cocktail']
            favorite, created = Favorite.objects.get_or_create(
                user=request.user, cocktail=cocktail
            )
            return Response(
                FavoriteSerializer(favorite).data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, cocktail_id):
        deleted, _ = Favorite.objects.filter(
            user=request.user, cocktail_id=cocktail_id
        ).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Favorito no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class MyRecipeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Cocktail.objects.filter(user=request.user).order_by('-created_at')
        serializer = CocktailSerializer(recipes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserCocktailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        cocktail = Cocktail.objects.create(
            name=data['name'],
            description=data.get('description', ''),
            difficulty=data['difficulty'],
            is_alcoholic=data.get('is_alcoholic', True),
            image=data.get('image') or None,
            steps=data.get('steps', []),
            tip=data.get('tip', ''),
            user=request.user,
        )

        for ing_data in data.get('ingredients', []):
            name = ing_data.get('name', '').strip()
            if not name:
                continue
            ingredient, _ = Ingredient.objects.get_or_create(name=name)
            CocktailIngredient.objects.create(
                cocktail=cocktail,
                ingredient=ingredient,
                quantity=ing_data.get('amount', ''),
                unit='',
            )

        return Response(CocktailSerializer(cocktail).data, status=status.HTTP_201_CREATED)


class MyRecipeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            recipe = Cocktail.objects.get(pk=pk, user=request.user)
        except Cocktail.DoesNotExist:
            return Response({"error": "Receta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Historial

class SearchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = SearchHistory.objects.filter(user=request.user).order_by('-created_at')[:20]
        return Response(SearchHistorySerializer(history, many=True).data)

    def post(self, request):
        # Deduplicar: ignorar si ya existe la misma búsqueda en los últimos 5 segundos
        recent = SearchHistory.objects.filter(
            user=request.user,
            search_text=request.data.get('search_text'),
            created_at__gte=timezone.now() - timedelta(seconds=5)
        ).exists()
        
        if recent:
            return Response(status=status.HTTP_200_OK)  # silenciar duplicado
        
        serializer = SearchHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        SearchHistory.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)