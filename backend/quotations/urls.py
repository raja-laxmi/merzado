from django.urls import path

from .views import (
    QuotationCreateView,
    MyQuotationListView,
    RFQQuotationsView,
)


urlpatterns = [

    path(
        "",
        QuotationCreateView.as_view(),
        name="quotation-create"
    ),

    path(
        "my/",
        MyQuotationListView.as_view(),
        name="my-quotations"
    ),

    path(
        "rfq/<int:rfq_id>/",
        RFQQuotationsView.as_view(),
        name="rfq-quotations"
    ),
]