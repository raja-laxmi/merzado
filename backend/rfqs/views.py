from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import RFQ
from .serializers import RFQSerializer
from accounts.permissions import IsBuyer
# Create your views here.



class RFQCreateView(generics.CreateAPIView):

    serializer_class = RFQSerializer

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def perform_create(self, serializer):
        serializer.save(
            buyer=self.request.user
        )


class RFQListView(generics.ListAPIView):

    serializer_class = RFQSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        queryset = RFQ.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                product_name__icontains=search
            )

        return queryset


class MyRFQListView(generics.ListAPIView):

    serializer_class = RFQSerializer

    permission_classes = [
        IsAuthenticated,
        IsBuyer
    ]

    def get_queryset(self):

        return RFQ.objects.filter(
            buyer=self.request.user
        ).order_by("-created_at")


class RFQDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = RFQSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return RFQ.objects.all()

    def perform_update(self, serializer):

        rfq = self.get_object()

        if rfq.buyer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only edit your own RFQs."
            )

        serializer.save()

    def perform_destroy(self, instance):

        if instance.buyer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only delete your own RFQs."
            )

        instance.delete()