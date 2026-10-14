
from django.contrib import admin
from .models import Project,Review,Table
# Register your models here.

@admin.register(Review)
class Review(admin.ModelAdmin):
    list_display = ('name','rating','source','is_published','created')
    list_filter = ('is_published','created','rating')
    search_fields = ('name','source','text')
    list_editable = ('is_published',)

@admin.register(Project)
class Project(admin.ModelAdmin):
    list_display = ('title','created')

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('number', 'seats', 'is_active')
    list_editable = ('seats', 'is_active')
    ordering = ('number',)