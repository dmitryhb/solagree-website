# Initial Consult native payment acceptance — September 29, 2026

Scope: HIR-248. This is an evidence ledger for Cal.com Cloud's live Stripe connection, not a
production launch sign-off. Each additional real payment needs separate user approval.

## Confirmed configuration

- First Available and the four direct consultant events are 30 minutes, $60 USD, and collect
  payment on booking through the Initial Consults Stripe connection. Jessica's direct event is
  paused. The hidden payment-check event uses $0.50 and is excluded from the website.
- Stripe account activation is complete. The hosted Cal.com event editor does not expose a
  test-mode switch; Cal.com support did not provide an isolated hosted native-payments sandbox.
  The separate Portal Stripe sandbox does not change this live connection.
- Stripe customer emails for successful payments and refunds were enabled in the account,
  but mailbox delivery has not been verified.

## Existing test evidence and open reconciliation

- Two earlier user-paid $0.50 hidden-event bookings demonstrated a successful payment and
  a confirmed booking with Taj. Their Stripe payment IDs, receipt delivery, and exact-one
  charge/booking reconciliation still need checking in the authenticated Stripe Dashboard.
- A previous canceled booking is shown as **Canceled** and **Paid** in Cal.com. Its detail view
  now says a refund is on its way. The booking was canceled before the September 29 change
  from `Never` to `If cancelled 2 calendar days before`. Cal.com's message alone does not prove
  that Stripe created a refund. Inspect the Stripe payment/refund timeline before classifying
  this case.
- Earlier abandoned-checkout observations did not establish a confirmed booking. The
  canceled checkout's retry path led to Jill's public profile rather than directly back to
  the selected event. Recheck this behavior in a controlled attempt; do not claim a safe
  retry or absence of duplicate charges from the UI alone.
- A historical Cal.com record displays `Error collecting card`. Its corresponding Stripe
  state, slot release, and retry result have not been reconciled.

## Remaining acceptance matrix

1. Reconcile each existing hidden-event booking against Stripe payment, charge, customer,
   amount, currency, receipt, refund status, Cal.com booking, host, and attendee email.
   Keep customer details and payment identifiers in the restricted provider views, not this
   document or Linear.
2. On the hidden event, check canceled checkout, failed/declined payment, and retry. For each
   attempt verify no usable unpaid booking or held slot remains, and that a successful retry
   creates exactly one charge and confirmed booking. A real successful retry requires its own
   user approval and user-operated payment handoff.
3. Verify receipt delivery in an actual mailbox. Do not infer delivery from enabled Stripe
   settings or a Cal.com payment status.
4. Repeat the required $60 production-event payment acceptance only with separate approval
   for every new real charge. Reconcile round-robin and direct events and Phone/Zoom paths.

Until these checks pass, HIR-248 remains In Progress. HIR-250 integrated acceptance and launch
decision remain downstream.
