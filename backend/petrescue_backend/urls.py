from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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

    # Adoption & reviews
    # Adoption & reviews
    path('api/adoptions/', include('apps.pets.adoptions_urls')),
    path('api/reviews/', include('apps.pets.reviews_urls')),
    path('api/chat/', include('apps.chat.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)