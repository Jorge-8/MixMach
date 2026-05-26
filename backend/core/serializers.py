from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Ingredient, Cocktail, CocktailIngredient, BeverageCategory

# Validacion de correos
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'password']

    def validate_email(self, value):

        # Valida que el email tenga un formato correcto
        email_validator = EmailValidator()

        try:
            email_validator(value)
        except ValidationError:
            raise serializers.ValidationError(
                "Ingresa un correo electrónico válido"
            )

        # Validar que no este duplicado
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Este correo ya está registrado"
            )
        return value

    def validate_first_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "El nombre es obligatorio"
            )
        return value
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # Usar email como username
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password'],
            is_active=False
        )
        return user


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category']

class CocktailIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = CocktailIngredient
        fields = ['id', 'ingredient', 'quantity', 'unit']

class CocktailSerializer(serializers.ModelSerializer):
    ingredients = CocktailIngredientSerializer(many=True, source='cocktailingredient_set', read_only=True)

    class Meta:
        model = Cocktail
        fields = [
            'id','name','description','difficulty','image',
            'is_alcoholic','steps','tip','created_at','user','ingredients'
        ]

class BeverageCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BeverageCategory
        fields = ['id', 'name', 'category']