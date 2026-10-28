from django import forms
from .models import Reservation, Project, Review, Table


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = [
            'name',
            'email',
            'tables',
            'date',
            'time',
            'guests',
            'comment',
        ]

        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Как к вам обращаться',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'name@yandex.ru',
                'required': True,
            }),
            'date': forms.DateInput(attrs={
                'type': 'date',
                'required': True,
            }),
            'time': forms.TimeInput(attrs={
                'type': 'time',
                'required': True,
            }),
            'guests': forms.NumberInput(attrs={
                'min': 1,
                'max': 20,
                'value': 2,
            }),
            'comment': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Особые пожелания (необязательно)',
            }),
        }





    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["tables"].queryset = Table.objects.filter(
            is_active=True
        ).order_by("number")


    def clean(self):
        cleaned_data = super().clean()

        tables = cleaned_data.get("tables")
        guests = cleaned_data.get("guests")

        if tables and guests:
            total_seats = sum(table.seats for table in tables)

            if guests > total_seats:
                self.add_error(
                    "guests",
                    f"За выбранными столиками всего {total_seats} мест."
                )

        return cleaned_data



class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description']


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['name', 'source', 'text', 'rating']
