from django import forms
from .models import Project, Review

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
        exclude = ['owner', 'vote_total', 'vote_ratio']

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['body', 'value']