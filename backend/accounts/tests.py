from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


User = get_user_model()


class BuyerOnlyViewTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.buyer = User.objects.create_user(
			username="new-buyer",
			password="password123",
			role=User.Role.BUYER,
		)
		self.other_buyer = User.objects.create_user(
			username="other-buyer",
			password="password123",
			role=User.Role.BUYER,
		)
		self.supplier = User.objects.create_user(
			username="supplier",
			password="password123",
			role=User.Role.SUPPLIER,
		)

	def test_buyer_only_returns_the_authenticated_buyer(self):
		self.client.force_authenticate(user=self.buyer)

		response = self.client.get("/api/accounts/buyer-only/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["username"], "new-buyer")
		self.assertEqual(response.data["role"], User.Role.BUYER)
		self.assertNotIn("other-buyer", str(response.data))
		self.assertEqual(response["Cache-Control"], "max-age=0, no-cache, no-store, must-revalidate, private")

	def test_supplier_cannot_access_buyer_only(self):
		self.client.force_authenticate(user=self.supplier)

		response = self.client.get("/api/accounts/buyer-only/")

		self.assertEqual(response.status_code, 403)

	def test_login_access_token_authenticates_buyer_only_request(self):
		login_response = self.client.post(
			"/api/accounts/login/",
			{"username": "new-buyer", "password": "password123"},
			format="json",
		)
		self.assertEqual(login_response.status_code, 200)

		response = self.client.get(
			"/api/accounts/buyer-only/",
			HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}",
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["username"], "new-buyer")

# Create your tests here.
