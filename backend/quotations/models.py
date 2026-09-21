from django.db import models

# Create your models here.
from django.conf import settings


from rfqs.models import RFQ


class Quotation(models.Model):

    rfq = models.ForeignKey(
        RFQ,
        on_delete=models.CASCADE,
        related_name="quotations"
    )

    supplier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="quotations"
    )

    quoted_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    estimated_delivery_days = models.PositiveIntegerField()

    message = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.supplier.username} - "
            f"{self.rfq.product_name}"
        )