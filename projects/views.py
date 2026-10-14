from django.shortcuts import render, redirect
from django.contrib import messages

from .models import Review, Table
from .forms import ReservationForm


# Create your views here.

def index(request):
    reviews = Review.objects.filter(is_published=True)
    tables = Table.objects.all()
    return render(request,
                  'projects/index.html',
                  {
                    'reviews': reviews,
'table': tables,
                  })


def reservations(request):
    reviews = Review.objects.filter(is_published=True)

    if request.method == "POST":
        form = ReservationForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(
                request,
                'Столик успешно забронирован! <3'
            )
            return redirect('index')
    else:
        form = ReservationForm()

    return render(
        request,
        'projects/reservations.html',
        {
            'form': form,
            'reviews': reviews
        }
    )
#