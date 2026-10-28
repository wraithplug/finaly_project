from django.db import models

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    RATING_CHOICES = [
        (5, '★★★★★'),
        (4, '★★★★'),
        (3, '★★★'),
        (2, '★★'),
        (1, '★'),
    ]
    name = models.CharField('Имя',max_length=200)
    text = models.TextField('Текст отзыва')
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    source = models.CharField('Источник',max_length=200,blank=True,null=True)

    is_published = models.BooleanField('Опубликован',default=False)
    created = models.DateTimeField('Дата',auto_now_add=True)

    class Meta:
        ordering = ['-created']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f'{self.name} - {self.rating}★'

class Table(models.Model):
    number = models.PositiveSmallIntegerField(
        unique=True,
        verbose_name='Номер столика'
    )
    seats = models.PositiveSmallIntegerField(
        default=2,
        verbose_name='Количество мест'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Доступен для бронирования'
    )

    class Meta:
        ordering = ['number']
        verbose_name = 'Столик'
        verbose_name_plural = 'Столики'

    def __str__(self):
        return f'Столик №{self.number} · {self.seats} мест'

class Reservation(models.Model):
    name = models.CharField(max_length=200,verbose_name="Имя")
    email = models.EmailField(blank=True,max_length=200,verbose_name="@YandexEmail")
    time = models.TimeField(verbose_name='Время бронирования')
    date = models.DateField(verbose_name='Дата бронирования')
    guests = models.PositiveSmallIntegerField(verbose_name="Колличество гостей")
    comment = models.TextField(blank=True,verbose_name='Особые пожелания (необязательно)')
    tables = models.ManyToManyField(Table,blank=True,related_name='reservations',verbose_name='Столики')
    def __str__(self):
        return self.name | self.date | self.time

    class Meta:
        ordering = ['date','time']
        verbose_name = "Бронирование"
        verbose_name_plural = "Бронирование"

class MenuItem(models.Model):
    CATEGORY_CHOICES = (
        ("breakfast", "Завтрак"),
        ("lunch", "Обед"),
        ("bakery", "Выпечка"),
        ("sweet", "Сладкое"),
    )
    name = models.CharField("Название блюда",max_length=200)
    description = models.TextField("Описание",blank=True)
    category = models.CharField("Категория",max_length=20,choices=CATEGORY_CHOICES,)
    icon = models.CharField("Значок",max_length=20,default="🍽️")

    class Meta:
        verbose_name = "Блюдо меню"
        verbose_name_plural = "Меню"
        ordering = ["category", "name"]

    def __str__(self):
        return self.name
