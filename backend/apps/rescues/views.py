from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Rescue
from .serializers import RescueSerializer

class RescueListCreateView(generics.ListCreateAPIView):
    queryset = Rescue.objects.all()
    serializer_class = RescueSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class RescueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rescue.objects.all()
    serializer_class = RescueSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)