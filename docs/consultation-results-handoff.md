# Consultation results handoff — HIR-268 / HIR-273

The October 2 consultation-results revision is implemented in the existing Portal service and Operations area. The public Website keeps its Cal.com embed and booking behavior. Browser callbacks, client email and hidden fields must not authorize CRM result writes or schedule consultant mail.

Portal owns the stable consultation UUID and server-side Cal.com booking UID lineage, capability, immutable submitted result, durable delivery and HubSpot mapping. One dedicated consultation Deal is associated with the client Contact; it does not overwrite case/referral Deals. Anne's current HubSpot edits are read live by Operations, and recommended plan/track never populate Create-a-Case automatically.

The requested native HubSpot form was inspected in Solagree account 47005346 on October 6. Actual products: Marketing/Sales/Content/Data Starter, Service Professional. The native editor offered Contact/Company/Ticket properties but no Deal. Its Contact identity/update mechanism cannot meet consultation-scoped authorization and separate history. A minimal Portal form alternative is prepared disabled pending approval; no Website link, consultant/client distribution, payment/reminder setting, Zoom integration or production process is published by this change.

Authoritative implementation/runbook: Portal `docs/consultation-results.md` on the accompanying HIR-268/HIR-273 PR. Both repositories retain their existing checkout changes and historical branches. Website starts from fresh `origin/develop` 12646043a1d1fcf4ae66123a7a36f9180e719653. Existing booking acceptance exceptions and deferred James Zoom work remain as documented in [the booking runbook](initial-consult-booking.md).

Rollout order: approve the Portal alternative → reviewed Portal migrations/configuration/artifact on controlled staging → provider write/readback and Operations UI acceptance → explicit production approval. No Website runtime change is required. Rollback disables Portal consultation input/delivery/webhook and restores its previous artifact while preserving additive data/history. Do not reactivate old attorney status-link or 48-hour check-in sends.
