from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Application
from .schemas import (
    ApplicationCreateSchema,
    ApplicationResponseSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
)


router = Router()


def error_response(message: str, status_code: int):
    return status_code, {"detail": message}


@router.post("", response={201: ApplicationResponseSchema, 400: dict})
def create_application(request, payload: ApplicationCreateSchema):
    application = Application.objects.create(**payload.model_dump())
    return 201, application


@router.get("", response=list[ApplicationResponseSchema])
def list_applications(request):
    return Application.objects.all()


@router.get("/{application_id}", response={200: ApplicationResponseSchema, 404: dict})
def get_application(request, application_id: int):
    application = get_object_or_404(Application, id=application_id)
    return application


@router.put("/{application_id}", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def update_application(request, application_id: int, payload: ApplicationUpdateSchema):
    application = get_object_or_404(Application, id=application_id)
    try:
        application.ensure_editable()
        for field, value in payload.model_dump().items():
            setattr(application, field, value)
        application.full_clean()
        application.save()
    except ValidationError as exc:
        return error_response("; ".join(exc.messages), 400)
    return application


@router.post("/{application_id}/submit", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def submit_application(request, application_id: int):
    application = get_object_or_404(Application, id=application_id)
    try:
        with transaction.atomic():
            application.submit()
            application.save(update_fields=["status", "submitted_at", "reviewer_comment", "updated_at"])
    except ValidationError as exc:
        return error_response("; ".join(exc.messages), 400)
    return application


@router.post("/{application_id}/start-review", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def start_review(request, application_id: int):
    application = get_object_or_404(Application, id=application_id)
    try:
        application.start_review()
        application.save(update_fields=["status", "updated_at"])
    except ValidationError as exc:
        return error_response("; ".join(exc.messages), 400)
    return application


@router.post("/{application_id}/decision", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def record_decision(request, application_id: int, payload: ReviewerDecisionSchema):
    application = get_object_or_404(Application, id=application_id)
    try:
        application.record_decision(payload.decision, payload.comment)
        application.save(update_fields=["status", "reviewer_comment", "reviewed_at", "updated_at"])
    except ValidationError as exc:
        return error_response("; ".join(exc.messages), 400)
    return application
