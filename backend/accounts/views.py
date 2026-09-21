from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsBuyer, IsSupplier
from .serializers import RegisterSerializer
from .token import CustomTokenObtainPairSerializer
from django.views.decorators.cache import never_cache
from django.views.decorators.vary import vary_on_headers

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsBuyer])
@never_cache
@vary_on_headers("Authorization")
def buyer_only(request):
    return Response({
        "message": "Welcome Buyer!",
        "username": request.user.username,
        "role": request.user.role,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsSupplier])
@never_cache
@vary_on_headers("Authorization")
def supplier_only(request):
    return Response({
        "message": "Welcome Supplier!",
        "username": request.user.username,
        "role": request.user.role,
    })



class BuyerOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsBuyer]

    def get(self, request):
        return Response({
            "message": "Welcome Buyer!",
            "username": request.user.username,
            "role": request.user.role,
        })

class SupplierOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsSupplier]

    def get(self, request):
        return Response({
            "message": "Welcome Supplier!",
            "username": request.user.username,
            "role": request.user.role,
        })

