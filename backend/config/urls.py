from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from ninja import NinjaAPI

from applications.api import router as applications_router


api = NinjaAPI(title="Workflow Tracker API", version="1.0.0")
api.add_router("/applications/", applications_router)


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", healthcheck),
    path("api/", api.urls),
]
