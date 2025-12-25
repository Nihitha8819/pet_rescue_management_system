from django.urls import path
from .views import ChatHistoryView, SendMessageView, ChatContactsView

urlpatterns = [
    path('history/<str:user_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('contacts/', ChatContactsView.as_view(), name='chat-contacts'),
]
