from django.urls import path
from .views import (
    AdoptionRequestCreateView,
    AdoptionRequestsByPetView,
    AdoptionRequestsByUserView,
    AdoptionRequestStatusUpdateView,
)

urlpatterns = [
    path('request/', AdoptionRequestCreateView.as_view(), name='adoption-request'),
    path('pet/<str:pet_id>/', AdoptionRequestsByPetView.as_view(), name='adoptions-by-pet'),
    path('user/', AdoptionRequestsByUserView.as_view(), name='adoptions-by-user'),
    path('<str:pk>/status/', AdoptionRequestStatusUpdateView.as_view(), name='adoption-status-update'),
]


