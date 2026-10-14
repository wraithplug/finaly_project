from django import forms
from .models import Reservation,Project, Review,Table


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = ['name', 'email','table', 'date', 'time', 'guests', 'comment']
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
        self.fields['table'].queryset = Table.objects.filter(is_published=True).order_by('number')


    def clean(self):
        cleaned_data = super().clean()
        table = cleaned_data.get('table')
        date = cleaned_data.get('date')
        time = cleaned_data.get('time')
        guests = cleaned_data.get('guests')

        if table and date and time and guests:
            self.add_error(
                'quwsts',
                f'За этим столиком только {table.seats} мест'
            )
            if self.instance.pk:
                reservation = Reservation.objects.get(pk=self.instance.pk)

            if reservation.exists:
                self.add_error(
                    'table',
                    'Этот столик уже забронирован на выбранное время'
                )
        return cleaned_data

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description']


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['name','source','text', 'rating']