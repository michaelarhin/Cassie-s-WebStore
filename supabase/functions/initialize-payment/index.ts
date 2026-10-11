// Supabase Edge Function: initialize-payment
// Called by the frontend after saving the order as "pending".
// Initializes a Paystack transaction and returns the payment URL.

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
    const { order_id, email, amount_ghs, callback_url } = await req.json();

    if (!order_id || !email || !amount_ghs) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Paystack expects amount in pesewas (GHS × 100)
    const amount_pesewas = Math.round(amount_ghs * 100);

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount_pesewas,
        currency: "GHS",
        reference: `TCA-${order_id.split("-")[0].toUpperCase()}-${Date.now()}`,
        callback_url: callback_url ?? "https://www.thecorporateaura.com/payment/callback",
        metadata: {
          order_id,
          custom_fields: [
            { display_name: "Order ID", variable_name: "order_id", value: order_id },
          ],
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return new Response(
        JSON.stringify({ error: paystackData.message ?? "Paystack initialization failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store the Paystack reference on the order so the webhook can match it
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    await supabase
      .from("orders")
      .update({ paystack_reference: paystackData.data.reference })
      .eq("id", order_id);

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference:         paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
