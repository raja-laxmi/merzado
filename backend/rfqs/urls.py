from django.urls import path

from .views import (
    RFQCreateView,
    RFQListView,
    MyRFQListView,
    RFQDetailView,
)


urlpatterns = [

    path(
        "",
        RFQCreateView.as_view(),
        name="rfq-create"
    ),

    path(
        "list/",
        RFQListView.as_view(),
        name="rfq-list"
    ),

    path(
        "my/",
        MyRFQListView.as_view(),
        name="my-rfqs"
    ),

    path(
        "<int:pk>/",
        RFQDetailView.as_view(),
        name="rfq-detail"
    ),
]