from django.urls import path
from .views import ReviewCreateView, ReviewsByPetView

urlpatterns = [
  path('', ReviewCreateView.as_view(), name='review-create'),
  path('pet/<str:pet_id>/', ReviewsByPetView.as_view(), name='reviews-by-pet'),
]


