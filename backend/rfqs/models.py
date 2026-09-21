from django.db import models
from django.conf import settings




class RFQ(models.Model):
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rfqs"
    )

    product_name = models.CharField(max_length=200)

    description = models.TextField()

    quantity = models.PositiveIntegerField()

    delivery_location = models.CharField(max_length=255)

    deadline = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name