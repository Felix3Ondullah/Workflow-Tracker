import json

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


class ApplicationApiTests(TestCase):
    def setUp(self):
        self.payload = {
            "applicant_name": "Jane Doe",
            "applicant_email": "jane@example.com",
            "company_name": "Acme Corp",
            "application_type": ApplicationType.RECORDATION,
            "description": "Initial draft",
        }

    def test_create_list_and_detail_endpoints(self):
        create_response = self.client.post(
            "/api/applications/",
            data=json.dumps(self.payload),
            content_type="application/json",
        )
        self.assertEqual(create_response.status_code, 201)

        application_id = create_response.json()["id"]

        list_response = self.client.get("/api/applications/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        detail_response = self.client.get(f"/api/applications/{application_id}")
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.json()["applicant_name"], self.payload["applicant_name"])

    def test_draft_can_be_updated_and_submitted(self):
        application = Application.objects.create(**self.payload)

        update_response = self.client.put(
            f"/api/applications/{application.id}",
            data=json.dumps({**self.payload, "company_name": "Updated Corp"}),
            content_type="application/json",
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()["company_name"], "Updated Corp")

        submit_response = self.client.post(f"/api/applications/{application.id}/submit")
        self.assertEqual(submit_response.status_code, 200)
        self.assertEqual(submit_response.json()["status"], ApplicationStatus.SUBMITTED)

    def test_full_review_flow_and_validation_rules(self):
        application = Application.objects.create(**self.payload)

        invalid_review_response = self.client.post(f"/api/applications/{application.id}/start-review")
        self.assertEqual(invalid_review_response.status_code, 400)

        self.client.post(f"/api/applications/{application.id}/submit")
        review_response = self.client.post(f"/api/applications/{application.id}/start-review")
        self.assertEqual(review_response.status_code, 200)
        self.assertEqual(review_response.json()["status"], ApplicationStatus.UNDER_REVIEW)

        invalid_decision_response = self.client.post(
            f"/api/applications/{application.id}/decision",
            data=json.dumps({"decision": ApplicationStatus.REJECTED, "comment": ""}),
            content_type="application/json",
        )
        self.assertEqual(invalid_decision_response.status_code, 400)

        decision_response = self.client.post(
            f"/api/applications/{application.id}/decision",
            data=json.dumps(
                {
                    "decision": ApplicationStatus.NEED_MORE_INFORMATION,
                    "comment": "Please upload supporting documents.",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(decision_response.status_code, 200)
        self.assertEqual(decision_response.json()["status"], ApplicationStatus.NEED_MORE_INFORMATION)

    def test_submitted_and_finalized_applications_cannot_be_edited(self):
        application = Application.objects.create(**self.payload)
        application.submit()
        application.save()

        submitted_edit_response = self.client.put(
            f"/api/applications/{application.id}",
            data=json.dumps({**self.payload, "company_name": "Blocked Update"}),
            content_type="application/json",
        )
        self.assertEqual(submitted_edit_response.status_code, 400)

        application.start_review()
        application.record_decision(ApplicationStatus.APPROVED, "")
        application.save()

        approved_edit_response = self.client.put(
            f"/api/applications/{application.id}",
            data=json.dumps({**self.payload, "company_name": "Still Blocked"}),
            content_type="application/json",
        )
        self.assertEqual(approved_edit_response.status_code, 400)
