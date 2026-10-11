// Supabase Edge Function: verify-payment
// Called by the frontend callback page to check a Paystack transaction status.
// Updates order to cancelled if the payment was abandoned or failed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL    = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Missing reference" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify with Paystack
    const verifyRes  = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { "Authorization": `Bearer ${PAYSTACK_SECRET}` },
    });
    const verifyData = await verifyRes.json();

    const paymentStatus = verifyData?.data?.status ?? "failed"; // success | abandoned | failed
    const orderId       = verifyData?.data?.metadata?.order_id
      ?? verifyData?.data?.metadata?.custom_fields?.[0]?.value;

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    if (paymentStatus === "success") {
      // Confirm the order (in case webhook was slow)
      if (orderId) {
        await supabase
          .from("orders")
          .update({
            status:              "confirmed",
            paystack_reference:  reference,
            paid_at:             new Date().toISOString(),
            paid_amount:         (verifyData.data.amount ?? 0) / 100,
          })
          .eq("id", orderId);
      }
    } else {
      // Abandoned or failed — mark order cancelled
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId)
          .eq("status", "pending"); // only cancel if still pending, not already confirmed
      }
    }

    return new Response(
      JSON.stringify({ payment_status: paymentStatus, order_id: orderId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
