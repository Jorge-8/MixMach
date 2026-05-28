from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, VerifyEmailView, LoginView, ProfileView,
    IngredientListView, PlatformCocktailListView, BeverageCategoryListView,
    FavoriteListView, FavoriteDetailView,
    MyRecipeListView, MyRecipeDetailView,
    SearchHistoryView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('ingredients/', IngredientListView.as_view(), name='ingredients-list'),
    path('cocktails/platform/', PlatformCocktailListView.as_view(), name='cocktails-platform'),
    path('beverages/categories/', BeverageCategoryListView.as_view(), name='beverage-categories'),
    path('favorites/', FavoriteListView.as_view(), name='favorites-list'),
    path('favorites/<int:cocktail_id>/', FavoriteDetailView.as_view(), name='favorites-detail'),
    path('my-recipes/', MyRecipeListView.as_view(), name='my-recipes-list'),
    path('my-recipes/<int:pk>/', MyRecipeDetailView.as_view(), name='my-recipes-detail'),
    path('search-history/', SearchHistoryView.as_view(), name='search-history'),
]
