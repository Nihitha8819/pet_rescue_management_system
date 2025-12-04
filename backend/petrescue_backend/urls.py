from django.urls import path, include
from apps.users.views import RegisterView, LoginView

urlpatterns = [
    # Auth endpoints
    path('api/auth/signup/', RegisterView.as_view(), name='signup'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    
    # Other API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/pets/', include('apps.pets.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/matches/', include('apps.matches.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
]