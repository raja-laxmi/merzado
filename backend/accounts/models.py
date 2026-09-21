from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        BUYER = 'buyer', 'Buyer'
        SUPPLIER = 'supplier', 'Supplier'
    role = models.CharField(max_length=10, choices=Role.choices)
    def __str__(self):
        return self.username
