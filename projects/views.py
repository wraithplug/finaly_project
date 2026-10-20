
from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from django.core.mail import send_mail

from .models import Review, Table, MenuItem
from .forms import ReservationForm


def index(request):
    reviews = Review.objects.filter(is_published=True)
    tables = Table.objects.filter(is_active=True).order_by("number")
    menu_items = MenuItem.objects.all()
    if request.method == "POST":
        form = ReservationForm(request.POST)

        if form.is_valid():
            reservation = form.save()

            notification_email = getattr(
                settings,
                "BOOKING_NOTIFICATION_EMAIL",
                ""
            )

            if notification_email:
                message_text = (
                    "Поступила новая бронь на сайте Mamma Mia!\n\n"
                    f"Имя: {reservation.name}\n"
                    f"Email клиента: {reservation.email}\n"
                    f"Столик: {reservation.table}\n"
                    f"Дата: {reservation.date}\n"
                    f"Время: {reservation.time}\n"
                    f"Количество гостей: {reservation.guests}\n"
                    f"Комментарий: {reservation.comment or 'Нет'}"
                )

                try:
                    send_mail(
                        subject="Новая бронь — Mamma Mia",
                        message=message_text,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[notification_email],
                        fail_silently=False,
                    )
                except Exception:
                    pass

            messages.success(
                request,
                "Столик успешно забронирован!"
            )
            return redirect("index")

    else:
        form = ReservationForm()

    return render(
        request,
        "projects/index.html",
        {
            "menu_items": menu_items,
            "reviews": reviews,
            "table": tables,
            "form": form,
        }
    )


def reservations(request):
    return redirect("index")
