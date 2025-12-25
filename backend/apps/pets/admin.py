from django.contrib import admin
from .models import Pet

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'pet_type', 'breed', 'status', 'created_at')
    search_fields = ('name', 'breed', 'pet_type')
    list_filter = ('status', 'pet_type', 'breed')
    ordering = ('created_at',)
    date_hierarchy = 'created_at'