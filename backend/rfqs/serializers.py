from rest_framework import serializers
from django.utils import timezone

from .models import RFQ


class RFQSerializer(serializers.ModelSerializer):

    buyer = serializers.ReadOnlyField(source="buyer.username")

    class Meta:
        model = RFQ
        fields = [
            "id",
            "buyer",
            "product_name",
            "description",
            "quantity",
            "delivery_location",
            "deadline",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "buyer",
            "created_at",
            "updated_at",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0."
            )
        return value

    def validate_deadline(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                "Deadline cannot be in the past."
            )
        return value