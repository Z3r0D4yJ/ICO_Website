// ============================================================
// send-order-notification — STUB
//
// STATUS: Niet geïmplementeerd.
//
// Wat moet hier komen:
//   1. Trigger na succesvolle Mollie betaling (zie mollie-webhook)
//   2. Bevestigingsmail naar customer_email via Resend
//   3. Notificatiemail naar Rico & Nico met orderdetails
//
// CLAUDE.md stap 14 — later.
// ============================================================

// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async () => {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'send-order-notification is not implemented yet (CLAUDE.md stap 14)',
    }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  )
})
