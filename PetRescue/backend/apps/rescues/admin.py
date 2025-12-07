from django.contrib import admin
from .models import Rescue

@admin.register(Rescue)
class RescueAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'contact_info', 'created_at')
    search_fields = ('name', 'location')
    list_filter = ('created_at',)