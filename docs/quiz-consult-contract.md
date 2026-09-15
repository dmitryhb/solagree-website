# Quiz Answers in Consult Requests

This document records the current website-to-Portal contract for stored quiz answers. It describes existing behavior; it does not add a completion or retention policy.

## Current inclusion behavior

- `app/composables/useQuizSession.ts` stores v2 quiz sessions in `localStorage` under `solagree.quiz.session.v1`. The persisted shape in `app/data/quiz-types.ts` contains the phase, current question, answers, and progress. It has no creation, completion, or expiry timestamp.
- `app/utils/quiz-navigation.ts` accepts the current v2 format and the supported v1 format. It migrates v1 `complete` to v2 `result`, validates answers against `app/data/quiz-schema.ts`, removes unknown questions and option IDs, deduplicates multi-select values, and prunes answers for hidden questions.
- `app/utils/consult-quiz-answers.ts` uses that same parser. A valid partial (`question`) or completed (`result`, including migrated v1 `complete`) session contributes all normalized visible answers. Malformed JSON, unsupported versions/phases, invalid answer shapes, and localStorage access errors contribute no answers.
- `app/components/consult/ConsultRequestForm.vue` reads the snapshot when the consult form is submitted. `app/services/consult-request-api.ts` sends the resulting `quizAnswers` list without changing its shape. `shared/types/consult-request.ts` defines each entry as question ID, canonical question text, schema-backed value, and canonical answer labels; it contains no session phase or timestamp.

## Portal boundary evidence

The adjacent Portal repository was inspected read-only at commit `137597c7b0ea437e97b9f92c37e2d1b76df31a1c`:

- `portal/server/utils/consult-requests/validation.ts` (`normalizeConsultQuizAnswers`) enforces list limits plus text shape and length for every submitted field. It does not have the website quiz schema or a completion timestamp.
- `portal/server/utils/consult-requests/creation.ts` persists the normalized list in the consult request's `quiz_answers` value.
- `portal/server/utils/hubspot/form-submissions.ts` serializes a non-empty normalized list to `solagree_quiz_payload`.
- `portal/shared/types/consult-requests.ts` uses the same answer-list payload shape and defines no phase, capture time, expiry time, or retention metadata.

## Retention and completion policy

There is currently no age check or TTL in the website snapshot reader, and no captured-at value exists from which to calculate one. Valid partial and completed snapshots remain eligible until quiz reset, invalid-snapshot cleanup, browser storage removal, or replacement by later quiz activity. Portal records and downstream HubSpot data have no separate quiz-answer retention rule in the inspected code.

A future product decision must define all of the following before behavior changes:

1. whether consult requests include partial sessions, completed sessions, or both;
2. the TTL duration and the event from which age is measured;
3. migration behavior for supported snapshots that have no timestamp;
4. whether an expired snapshot is only omitted from a consult request or also removed from localStorage; and
5. whether persisted Portal and HubSpot quiz data has a separate retention period.

Any completion-only or TTL policy needs explicit authorization, a timestamp/schema migration, and migration tests. Until then, safe schema validation is applied without changing the existing inclusion behavior or payload shape.
