from datetime import datetime

from ninja import Schema
from pydantic import EmailStr, field_validator

from .models import ApplicationStatus, ApplicationType


class ApplicationBaseSchema(Schema):
    applicant_name: str
    applicant_email: EmailStr
    company_name: str
    application_type: str
    description: str

    @field_validator("application_type")
    @classmethod
    def validate_application_type(cls, value: str) -> str:
        allowed = {choice for choice, _label in ApplicationType.choices}
        if value not in allowed:
            raise ValueError("Invalid application type.")
        return value


class ApplicationCreateSchema(ApplicationBaseSchema):
    pass


class ApplicationUpdateSchema(ApplicationBaseSchema):
    pass


class ReviewerDecisionSchema(Schema):
    decision: str
    comment: str = ""

    @field_validator("decision")
    @classmethod
    def validate_decision(cls, value: str) -> str:
        allowed = {
            ApplicationStatus.APPROVED,
            ApplicationStatus.NEED_MORE_INFORMATION,
            ApplicationStatus.REJECTED,
        }
        if value not in allowed:
            raise ValueError("Decision must be Approved, Need More Information, or Rejected.")
        return value


class ApplicationResponseSchema(Schema):
    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: EmailStr
    company_name: str
    application_type: str
    description: str
    status: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None
    reviewed_at: datetime | None
