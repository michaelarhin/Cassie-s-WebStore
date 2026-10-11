// Supabase Edge Function: paystack-webhook
// Receives Paystack payment events, verifies the signature,
// and updates the order status on successful charge.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const PAYSTACK_SECRET    = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL       = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY       = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const body = await req.text();

  // Verify Paystack HMAC-SHA512 signature
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const expected  = createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata, amount, currency } = event.data;
    const order_id = metadata?.order_id ?? metadata?.custom_fields?.[0]?.value;

    if (!order_id) {
      return new Response("Missing order_id in metadata", { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Verify the transaction directly with Paystack before trusting
    const verifyRes  = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { "Authorization": `Bearer ${PAYSTACK_SECRET}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return new Response("Payment verification failed", { status: 400 });
    }

    // Update order to confirmed
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        paystack_reference: reference,
        paid_at: new Date().toISOString(),
        paid_amount: amount / 100, // convert pesewas back to GHS
      })
      .eq("id", order_id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
