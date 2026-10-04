# Livio Venture platform plan

## What stays the same

The existing Livio Venture homepage, imagery, typography, and overall visual direction stay intact. New pages will feel like part of that website rather than replacing or redesigning it. Existing homepage sections remain visible while their relevant links can lead to the new working experiences.

## Page map and student journey

- `/` — existing homepage, retained.
- Sign in — email one-time-code entry; phone sign-in only if an available provider can support it. Sign out from the account area.
- Profile — collect and edit the required personal, academic, destination, and budget details. A student is returned to the action they originally chose after saving.
- Universities — searchable, filterable European catalogue with undergraduate/postgraduate course names on each university; course selection leads to Apply.
- Courses — detailed, sortable course table with eligibility, fees, duration, intake, and Apply.
- Advisor — top five matches, fit checks, catalogue-grounded chat, and escalation to a human when the answer is uncertain.
- Apply — selected courses, saved profile confirmation, consent, submission and status.
- Estimate — request form, best-three result with illustrative costs when eligible, or human review.
- Counsellor — available session slots and booking status.
- Account — profile, applications, estimates, questions, sessions, replies, document handling, data export and deletion.
- Admin — protected queues, replies and decisions, catalogue management and audit trail; counsellors see only the session tools appropriate to their role.
- How it works and Privacy — public process diagram and data-use information.

Any action requiring a student profile sends a signed-in student to the profile form first; sign-in precedes that for visitors. Public browsing remains available.

## Technical approach

This project already runs on TanStack Start, React, TypeScript and Tailwind. Keep that working foundation rather than migrating the current website to Next.js/Prisma/Docker. Use Lovable Cloud for persistent PostgreSQL-backed data, authentication, file storage and server-side operations; use server-side authorization and a separate roles table. Keep student records private, admin access checked on the server, and validation on all writes. Email sign-in is the initial authentication path; phone OTP requires a supported phone provider and configuration before it can be promised.

Store the catalogue by university, course, level, field and country so more continents can be added without changing the student journey. Seed at least 14 European universities with UG and PG courses; label all sample costs and requirements **illustrative / unverified** until real catalogue data is supplied. A pure, tested matching function implements the stated weighted score (30/25/20/15/10), partial credit, and screening rules. An AI service only uses the catalogue and saved profile for answers; unavailable or uncertain answers create human-review questions. Never fabricate fees, deadlines, visa rules or eligibility.

## Data structure

- Authentication identity, plus separate `user_roles` for STUDENT, ADMIN and COUNSELLOR.
- `student_profiles` for the required fields, consent and ownership.
- `universities` and `courses` for location, rankings, fees, living costs, requirements, intakes, scholarships, field, level and verification state.
- `applications`, `estimate_requests` and `questions`, each tied to the student and relevant course or result.
- `sessions` for counsellor appointments with a uniqueness safeguard against double-booking.
- `status_history` for timestamped transitions and reasons, `notifications` for student-visible updates, `documents` for controlled uploads, and `audit_log` for administrative actions.

## Phases and review gates

1. **This plan.** Review and approve before implementation.
2. **Foundation.** Preserve the homepage; add auth, role safety, profile form and gate. Verify sign-in and saved details across a fresh session.
3. **Catalogue.** Add schema and illustrative European seed data, then Universities and Courses pages with search, filters, sorting and empty/error states.
4. **Advisor.** Implement and unit-test scoring; show matches and guarded chat; create question tickets for unknowns.
5. **Applications and estimates.** Build both submission flows, screening, handoff queues and timestamped status history.
6. **Student follow-through.** Account, counsellor scheduling, notifications and email where service credentials are available.
7. **Staff tools.** Role-protected queues, replies, session management, CSV catalogue import and audit log.
8. **Finish.** Public process and privacy pages, export/delete tools, accessibility and performance review, documentation and full end-to-end regression.

After each implementation phase, test its real user flow in the browser and provide desktop/mobile screenshots plus a concise test report for review before continuing. Light/dark coverage and recordings belong to the final verification pass. External email delivery, phone OTP, and verified university figures may need provider configuration or source data from you; until then, the interface should clearly disclose what is illustrative or unavailable.