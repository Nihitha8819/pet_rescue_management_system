from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    UserProfileView,
    UserListView,
    UserPreferencesView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('users/', UserListView.as_view(), name='user-list'),
]
