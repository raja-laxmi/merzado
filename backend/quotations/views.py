from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Quotation
from .serializers import QuotationSerializer

from accounts.permissions import (
    IsSupplier,
)


class QuotationCreateView(generics.CreateAPIView):

    serializer_class = QuotationSerializer

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def perform_create(self, serializer):

        serializer.save(
            supplier=self.request.user
        )


class MyQuotationListView(generics.ListAPIView):

    serializer_class = QuotationSerializer

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def get_queryset(self):

        return Quotation.objects.filter(
            supplier=self.request.user
        ).order_by("-created_at")


class RFQQuotationsView(generics.ListAPIView):

    serializer_class = QuotationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        rfq_id = self.kwargs["rfq_id"]

        return Quotation.objects.filter(
            rfq_id=rfq_id,
            rfq__buyer=self.request.user
        ).order_by("-created_at")