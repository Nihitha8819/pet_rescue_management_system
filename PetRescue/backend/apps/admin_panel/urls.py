from django.urls import path
from .views import AdminDashboardView, ManageUsersView
from apps.pets.views import AdminPetReportListView

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('manage-users/', ManageUsersView.as_view(), name='manage-users'),
    path('reports/', AdminPetReportListView.as_view(), name='admin-reports'),
]