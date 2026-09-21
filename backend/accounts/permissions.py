from rest_framework.permissions import BasePermission


class IsBuyer(BasePermission):
    """
    Custom permission to only allow buyers to access certain views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'buyer'


class IsSupplier(BasePermission):
    """
    Custom permission to only allow suppliers to access certain views.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'supplier'

from rest_framework.permissions import BasePermission

