from django.urls import path
from .views import RescueListCreateView, RescueRetrieveUpdateDestroyView

urlpatterns = [
    path('rescues/', RescueListCreateView.as_view(), name='rescue-list-create'),
    path('rescues/<str:pk>/', RescueRetrieveUpdateDestroyView.as_view(), name='rescue-retrieve-update-destroy'),
]