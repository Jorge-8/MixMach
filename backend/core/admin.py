from django.contrib import admin
from .models import User, Ingredient, Cocktail, CocktailIngredient, Favorite, SearchHistory

admin.site.register(User)
admin.site.register(Ingredient)
admin.site.register(Cocktail)
admin.site.register(CocktailIngredient)
admin.site.register(Favorite)
admin.site.register(SearchHistory)