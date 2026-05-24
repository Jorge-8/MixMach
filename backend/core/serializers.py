from rest_framework import serializers
from django.contrib.auth import get_user_model

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