from django.urls import path
from .views import (
    PetListView,
    PetDetailView,
    PetCreateView,
    PetUpdateView,
    PetDeleteView,
    UserPetListView,
    PetReportCreateView,
    PetReportListView,
    UserPetReportListView,
    PetReportUpdateView,
    PetRegisterView,
)

urlpatterns = [
    # New search endpoint (extended)
    path('', PetListView.as_view(), name='pet-list-root'),

    # Register pet (must come before dynamic <pk> route)
    path('register/', PetRegisterView.as_view(), name='pet-register'),

    # Pet endpoints (existing)
    path('create/', PetCreateView.as_view(), name='pet-create'),
    path('all/', PetListView.as_view(), name='pet-list'),
    path('user/<str:user_id>/', UserPetListView.as_view(), name='user-pet-list'),
    path('update/<str:pk>/', PetUpdateView.as_view(), name='pet-update'),
    path('delete/<str:pk>/', PetDeleteView.as_view(), name='pet-delete'),
    path('<str:pk>/', PetDetailView.as_view(), name='pet-detail'),
    
    # Pet Report endpoints
    path('report/create/', PetReportCreateView.as_view(), name='pet-report-create'),
    path('reports/', PetReportListView.as_view(), name='pet-report-list'),
    path('reports/user/<str:user_id>/', UserPetReportListView.as_view(), name='user-pet-report-list'),
    path('report/update/<str:pk>/', PetReportUpdateView.as_view(), name='pet-report-update'),
]
