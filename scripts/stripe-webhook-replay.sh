#!/usr/bin/env bash
set -euo pipefail

if ! command -v stripe >/dev/null 2>&1; then
  echo "Stripe CLI is required. Install: https://docs.stripe.com/stripe-cli"
  exit 1
fi

echo "Replaying Stripe webhook scenarios to current listener..."
echo "Tip: run this in another terminal first: stripe listen --forward-to localhost:3000/api/stripe/webhook"

EVENTS=(
  "checkout.session.completed"
  "customer.subscription.created"
  "customer.subscription.updated"
  "customer.subscription.deleted"
)

for event in "${EVENTS[@]}"; do
  echo "Triggering: ${event}"
  stripe trigger "${event}"
  sleep 1
done

echo "Done. Check your app logs and Stripe webhook endpoint responses."
