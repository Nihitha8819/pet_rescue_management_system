from django.urls import path
from .views import (
    AdminDashboardView,
    ManageUsersView,
    AdminPetListView,
    AdminPetStatusUpdateView,
    AdminAdoptionRequestListView,
    AdminReviewListView,
    AdminUserStatusUpdateView,
    AdminPetReportStatusUpdateView,
)
from apps.pets.views import AdminPetReportListView

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('manage-users/', ManageUsersView.as_view(), name='manage-users'),
    path('reports/', AdminPetReportListView.as_view(), name='admin-reports'),

    # Extended admin capabilities
    path('pets/', AdminPetListView.as_view(), name='admin-pets'),
    path('pets/<str:pk>/status/', AdminPetStatusUpdateView.as_view(), name='admin-pet-status'),
    path('adoptions/', AdminAdoptionRequestListView.as_view(), name='admin-adoptions'),
    path('reviews/', AdminReviewListView.as_view(), name='admin-reviews'),
    path('users/<str:pk>/status/', AdminUserStatusUpdateView.as_view(), name='admin-user-status'),
    path('reports/<str:pk>/status/', AdminPetReportStatusUpdateView.as_view(), name='admin-report-status'),
]