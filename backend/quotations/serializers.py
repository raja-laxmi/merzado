from rest_framework import serializers

from .models import Quotation
from rfqs.models import RFQ


class QuotationSerializer(serializers.ModelSerializer):

    supplier = serializers.ReadOnlyField(
        source="supplier.username"
    )

    class Meta:

        model = Quotation

        fields = [
            "id",
            "rfq",
            "supplier",
            "quoted_price",
            "estimated_delivery_days",
            "message",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "supplier",
            "created_at",
            "updated_at",
        ]

    def validate_quoted_price(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Quoted price must be greater than 0."
            )

        return value

    def validate_estimated_delivery_days(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Delivery days must be greater than 0."
            )

        return value

    def validate_rfq(self, rfq):

        request = self.context["request"]

        # Supplier cannot quote their own RFQ
        if rfq.buyer == request.user:
            raise serializers.ValidationError(
                "You cannot submit a quotation for your own RFQ."
            )

        return rfq