from django.urls import path
from .views import RegisterView, VerifyEmailView, LoginView, ProfileView, IngredientListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view()),
    path('ingredients/', IngredientListView.as_view(), name='ingredients-list'),
]