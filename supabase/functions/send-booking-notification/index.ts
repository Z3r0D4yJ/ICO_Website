// ============================================================
// send-booking-notification — STUB
//
// STATUS: Niet geïmplementeerd. Dit is een placeholder zodat het
// bestaan van de functie expliciet is en de directory niet leeg
// blijft.
//
// Wat moet hier komen:
//   1. Webhook trigger vanuit Supabase (database webhook op
//      INSERT bookings) of expliciete RPC-aanroep
//   2. Resend API call → bevestigingsmail naar p_customer_email
//   3. WhatsApp Business API call → bericht naar Rico & Nico
//      (of fallback: queue dat admin handmatig kan versturen)
//
// Vereiste env vars:
//   RESEND_API_KEY
//   WHATSAPP_PHONE_ID
//   WHATSAPP_ACCESS_TOKEN
//   ADMIN_PHONE_RICO, ADMIN_PHONE_NICO
//
// CLAUDE.md stap 14 — wordt later opgepakt.
// ============================================================

// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async () => {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'send-booking-notification is not implemented yet (CLAUDE.md stap 14)',
    }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  )
})
