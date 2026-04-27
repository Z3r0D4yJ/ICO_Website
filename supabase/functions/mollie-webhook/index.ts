// ============================================================
// mollie-webhook — STUB
//
// STATUS: Niet geïmplementeerd.
//
// Wat moet hier komen:
//   1. Mollie POST'ert payment_id naar deze webhook
//   2. Fetch payment status via Mollie API
//   3. Update orders.status: pending → paid / failed / cancelled
//   4. Bij paid: roep send-order-notification aan
//
// Vereiste env vars:
//   MOLLIE_API_KEY
//
// Endpoint moet bereikbaar zijn op:
//   https://<project>.functions.supabase.co/mollie-webhook
//
// CLAUDE.md stap 11 — later.
// ============================================================

// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async () => {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'mollie-webhook is not implemented yet (CLAUDE.md stap 11)',
    }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  )
})
