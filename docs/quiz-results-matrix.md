# Solagree Quiz Answers and Results Matrix

This document describes the current quiz behavior in the website code as of May 28, 2026.

Source files:

- `app/data/quiz-schema.ts` defines questions, answers, and conditional visibility.
- `app/utils/quiz-results.ts` defines final result routing.
- `app/data/quiz-policies.ts` defines policy-driven result mappings.
- `app/data/quiz-results.ts` defines the displayed result copy.

## Current Results

| Result ID | Displayed title | Primary CTA |
| --- | --- | --- |
| `solagree-fit` | You look like a fit for a Solagree consult. | Book a Solagree consult |
| `attorney-consult-first` | An attorney consult should happen first. | Book an attorney consult |
| `not-fit-right-now` | Solagree may not be the right fit right now. | Review general legal-help resources |

## Current Result Precedence

The quiz does not score answers. It checks conditions in this order and stops at the first match.

| Priority | Condition | Result |
| --- | --- | --- |
| 1 | `spouseContact = cannot-find` | `not-fit-right-now` |
| 1 | `spouseContact = unknown-whereabouts` | `not-fit-right-now` |
| 1 | `spouseContact = know-where-not-communicating` | `not-fit-right-now` |
| 2 | `paymentReadiness = not-ready` | `not-fit-right-now` |
| 3 | `legalAdvice = yes` | `attorney-consult-first` |
| 4 | `legalAdvice = not-sure` | `attorney-consult-first` |
| 5 | `spouseCooperation = no` | `attorney-consult-first` |
| 6 | `paymentReadiness = need-payment-plan` | `solagree-fit` |
| 7 | Any remaining completed path | `solagree-fit` |

Important: the current code has four answer conditions that can produce `not-fit-right-now`, not two. Three are under spouse contact, and one is under payment readiness.

## Decision Flow

```mermaid
flowchart TD
  A["Completed quiz answers"] --> B{"Spouse contact is cannot-find, unknown-whereabouts, or no-contact?"}
  B -- Yes --> NF["not-fit-right-now"]
  B -- No --> C{"Payment readiness is not-ready?"}
  C -- Yes --> NF
  C -- No --> D{"Legal advice is yes?"}
  D -- Yes --> AC["attorney-consult-first"]
  D -- No --> E{"Legal advice is not-sure?"}
  E -- Yes --> AC
  E -- No --> F{"Spouse cooperation is no?"}
  F -- Yes --> AC
  F -- No --> G{"Payment readiness is need-payment-plan?"}
  G -- Yes --> SF["solagree-fit"]
  G -- No --> SF
```

## Question Matrix

| Question | Answer | Visible when | Direct result impact | Metadata impact |
| --- | --- | --- | --- | --- |
| Where will your divorce be filed? | Any state | Always | None | Stores selected state. Adds deferred policy ID `state-specific-result-messaging`, but this does not block or change the result. |
| Do you have children under 18? | Yes | Always | None | Enables parenting screener. |
| Do you have children under 18? | No | Always | None | Hides parenting screener and parenting details. |
| Do you need help working through parenting, custody, or child-support issues? | Yes | Only when children = yes | None | Adds tag `parenting`. If financial screener is also yes, adds tag `both`. |
| Do you need help working through parenting, custody, or child-support issues? | No | Only when children = yes | None | No result or tag impact. |
| Which parenting topics apply to your situation? | Any selected topic | Only when children = yes and parenting screener = yes | None | Stores selected parenting topic IDs. |
| Are there financial issues that may complicate your divorce? | Yes | Always | None | Adds tag `financial`. If parenting concerns also exist, adds tag `both`. Enables financial details. |
| Are there financial issues that may complicate your divorce? | No | Always | None | Hides financial details. |
| Which financial topics apply to your situation? | Any selected topic | Only when financial screener = yes | None | Stores selected financial topic IDs and adds tag `financial-complexity`. |
| Do you and your spouse have contact with each other these days? | Yes / `direct-contact` | Always | Allows quiz to continue to spouse cooperation. No direct result. | Stores spouse contact. |
| Do you and your spouse have contact with each other these days? | No, I can't find them / `cannot-find` | Always | `not-fit-right-now` | Adds tag `missing-spouse`. |
| Do you and your spouse have contact with each other these days? | No, we have no contact / `know-where-not-communicating` | Always | `not-fit-right-now` | Adds tag `no-spouse-communication`. |
| Do you and your spouse have contact with each other these days? | Not sure / `unknown-whereabouts` | Always | `not-fit-right-now` | Adds tag `missing-spouse`. |
| Do you expect your spouse to cooperate in the divorce process? | Yes | Only when spouse contact = direct-contact | None | Stores spouse cooperation. |
| Do you expect your spouse to cooperate in the divorce process? | No | Only when spouse contact = direct-contact | `attorney-consult-first`, unless an earlier `not-fit-right-now` condition already matched | Adds tag `spouse-resistance`. |
| Do you expect your spouse to cooperate in the divorce process? | I am not sure yet | Only when spouse contact = direct-contact | None | Stores spouse cooperation. |
| Do you think you need legal advice before moving forward? | Yes | Always | `attorney-consult-first`, unless an earlier `not-fit-right-now` condition already matched | Adds tag `legal-advice-needed`. |
| Do you think you need legal advice before moving forward? | No | Always | None | Stores legal advice answer. |
| Do you think you need legal advice before moving forward? | I am not sure | Always | `attorney-consult-first`, unless an earlier `not-fit-right-now` condition already matched | Adds tag `legal-advice-needed`. |
| Do you have the ability to pay for a service to help you? | Yes, I am ready now | Always | `solagree-fit` if no higher-priority condition matched | Stores payment readiness. |
| Do you have the ability to pay for a service to help you? | I would need a payment plan | Always | `solagree-fit` if no higher-priority condition matched | Adds tag `payment-plan`. |
| Do you have the ability to pay for a service to help you? | No, not right now | Always | `not-fit-right-now`, unless a spouse-contact `not-fit-right-now` condition already matched first | Stores payment readiness. |

## Not A Fit Conditions To Review

The current `not-fit-right-now` paths are:

| Trigger answer | Code value | Source |
| --- | --- | --- |
| No, I can't find them | `spouseContact = cannot-find` | `app/data/quiz-policies.ts` |
| Not sure | `spouseContact = unknown-whereabouts` | `app/data/quiz-policies.ts` |
| No, we have no contact | `spouseContact = know-where-not-communicating` | `app/data/quiz-policies.ts` |
| No, not right now | `paymentReadiness = not-ready` | `app/utils/quiz-results.ts` |

If only two answers should produce `not-fit-right-now`, this is the likely area to change.

## Attorney Consult First Conditions

These answers produce `attorney-consult-first` only when no higher-priority `not-fit-right-now` condition has already matched:

| Trigger answer | Code value | Source |
| --- | --- | --- |
| Legal advice = Yes | `legalAdvice = yes` | `app/utils/quiz-results.ts` |
| Legal advice = I am not sure | `legalAdvice = not-sure` | `app/utils/quiz-results.ts` |
| Spouse cooperation = No | `spouseCooperation = no` | `app/utils/quiz-results.ts` |

## Solagree Fit Conditions

The quiz returns `solagree-fit` when:

- There is no spouse-contact `not-fit-right-now` answer.
- Payment readiness is not `not-ready`.
- Legal advice is not `yes` or `not-sure`.
- Spouse cooperation is not `no`.

Both `paymentReadiness = ready-now` and `paymentReadiness = need-payment-plan` currently return `solagree-fit` when the higher-priority conditions do not match.

## Notes For Tweaking

- Parenting answers currently do not affect the final result. They only collect metadata and topics.
- Financial answers currently do not affect the final result. They only collect metadata and topics.
- State currently does not affect the final result. It adds a deferred policy marker for future state-specific messaging.
- The current result routing is all-or-nothing by precedence. If a high-priority `not-fit-right-now` condition matches, later attorney-consult answers do not matter.
