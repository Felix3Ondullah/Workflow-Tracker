from django.core.exceptions import ValidationError
from django.test import TestCase

from .models import Application, ApplicationStatus, ApplicationType


class ApplicationWorkflowTests(TestCase):
    def setUp(self):
        self.application = Application.objects.create(
            applicant_name="Jane Doe",
            applicant_email="jane@example.com",
            company_name="Acme Corp",
            application_type=ApplicationType.RECORDATION,
            description="Initial draft",
        )

    def test_draft_can_be_submitted(self):
        self.application.submit()
        self.assertEqual(self.application.status, ApplicationStatus.SUBMITTED)
        self.assertIsNotNone(self.application.submitted_at)

    def test_submitted_application_can_start_review(self):
        self.application.submit()
        self.application.start_review()
        self.assertEqual(self.application.status, ApplicationStatus.UNDER_REVIEW)

    def test_reviewer_comment_required_for_rejection(self):
        self.application.submit()
        self.application.start_review()

        with self.assertRaisesMessage(ValidationError, "A reviewer comment is required for this decision."):
            self.application.record_decision(ApplicationStatus.REJECTED, "")

    def test_need_more_information_can_be_resubmitted(self):
        self.application.submit()
        self.application.start_review()
        self.application.record_decision(ApplicationStatus.NEED_MORE_INFORMATION, "Please add more detail.")
        self.application.submit()

        self.assertEqual(self.application.status, ApplicationStatus.SUBMITTED)
        self.assertEqual(self.application.reviewer_comment, "")
