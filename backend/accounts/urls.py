from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    buyer_only,
    supplier_only,
)



urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "buyer-only/",
        buyer_only,
        name="buyer-only"
    ),

    path(
        "supplier-only/",
        supplier_only,
        name="supplier-only"
    ),

   
]