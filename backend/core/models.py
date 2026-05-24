from django.db import models
from django.contrib.auth.models import AbstractUser


# 🔹 Usuario
class User(AbstractUser):
    photo = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Validacion por email
    email = models.EmailField(unique=True)


# 🔹 Ingredientes
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

# 🔹 Cócteles
class Cocktail(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    is_alcoholic = models.BooleanField(default=True)
    steps = models.JSONField(default=list, blank=True)
    tip = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)

    # Usuario creador (para recetas personalizadas)
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# 🔹 Relación cóctel - ingrediente
class CocktailIngredient(models.Model):
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=50)
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.cocktail.name} - {self.ingredient.name}"


# 🔹 Favoritos
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'cocktail')  # evita duplicados


# 🔹 Historial de búsquedas
class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    search_text = models.CharField(max_length=255, blank=True, null=True)
    cocktail = models.ForeignKey(Cocktail, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)