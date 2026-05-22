from uuid import uuid4

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class ApplicationType(models.TextChoices):
    RECORDATION = "Recordation", "Recordation"
    RENEWAL = "Renewal", "Renewal"
    CHANGE_OF_OWNERSHIP = "Change of Ownership", "Change of Ownership"
    CHANGE_OF_NAME = "Change of Name", "Change of Name"
    DISCONTINUATION = "Discontinuation", "Discontinuation"


class ApplicationStatus(models.TextChoices):
    DRAFT = "Draft", "Draft"
    SUBMITTED = "Submitted", "Submitted"
    UNDER_REVIEW = "Under Review", "Under Review"
    NEED_MORE_INFORMATION = "Need More Information", "Need More Information"
    APPROVED = "Approved", "Approved"
    REJECTED = "Rejected", "Rejected"


class Application(models.Model):
    tracking_number = models.CharField(max_length=32, unique=True, editable=False)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(max_length=50, choices=ApplicationType.choices)
    description = models.TextField()
    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
    )
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.tracking_number} - {self.applicant_name}"

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = f"APP-{uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def ensure_editable(self) -> None:
        if self.status not in {ApplicationStatus.DRAFT, ApplicationStatus.NEED_MORE_INFORMATION}:
            raise ValidationError("Only Draft or Need More Information applications can be edited.")

    def submit(self) -> None:
        if self.status not in {ApplicationStatus.DRAFT, ApplicationStatus.NEED_MORE_INFORMATION}:
            raise ValidationError("Only Draft or Need More Information applications can be submitted.")
        self.status = ApplicationStatus.SUBMITTED
        self.submitted_at = timezone.now()
        self.reviewer_comment = ""

    def start_review(self) -> None:
        if self.status != ApplicationStatus.SUBMITTED:
            raise ValidationError("Only Submitted applications can move to Under Review.")
        self.status = ApplicationStatus.UNDER_REVIEW

    def record_decision(self, decision: str, comment: str) -> None:
        if self.status != ApplicationStatus.UNDER_REVIEW:
            raise ValidationError("Only Under Review applications can receive a reviewer decision.")
        if decision in {ApplicationStatus.NEED_MORE_INFORMATION, ApplicationStatus.REJECTED} and not comment.strip():
            raise ValidationError("A reviewer comment is required for this decision.")
        if decision not in {
            ApplicationStatus.APPROVED,
            ApplicationStatus.NEED_MORE_INFORMATION,
            ApplicationStatus.REJECTED,
        }:
            raise ValidationError("Invalid reviewer decision.")

        self.status = decision
        self.reviewer_comment = comment.strip()
        self.reviewed_at = timezone.now()
