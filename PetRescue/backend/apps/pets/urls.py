from django.urls import path
from .views import (
    PetListView, PetDetailView, PetCreateView, PetUpdateView, PetDeleteView,
    UserPetListView, PetReportCreateView, PetReportListView, UserPetReportListView,
    PetReportDetailView, PetReportUpdateView, MarkPetAsFoundView, 
    AdminActivateReportView, AdminUpdateReportStatusView
)

urlpatterns = [
    # Pet endpoints
    path('create/', PetCreateView.as_view(), name='pet-create'),
    path('all/', PetListView.as_view(), name='pet-list'),
    path('user/<str:user_id>/', UserPetListView.as_view(), name='user-pet-list'),
    path('update/<str:pk>/', PetUpdateView.as_view(), name='pet-update'),
    path('delete/<str:pk>/', PetDeleteView.as_view(), name='pet-delete'),
    
    # Pet Report endpoints (MUST come before <str:pk> to avoid conflicts)
    path('report/create/', PetReportCreateView.as_view(), name='pet-report-create'),
    path('reports/', PetReportListView.as_view(), name='pet-report-list'),
    path('reports/user/<str:user_id>/', UserPetReportListView.as_view(), name='user-pet-report-list'),
    path('report/<str:pk>/', PetReportDetailView.as_view(), name='pet-report-detail'),
    path('report/<str:pk>/mark-found/', MarkPetAsFoundView.as_view(), name='pet-report-mark-found'),
    path('report/update/<str:pk>/', PetReportUpdateView.as_view(), name='pet-report-update'),
    
    # Admin endpoints
    path('admin/reports/<str:pk>/activate/', AdminActivateReportView.as_view(), name='admin-activate-report'),
    path('admin/reports/<str:pk>/status/', AdminUpdateReportStatusView.as_view(), name='admin-update-report-status'),
    
    # This MUST be last because it's a catch-all pattern
    path('<str:pk>/', PetDetailView.as_view(), name='pet-detail'),
]