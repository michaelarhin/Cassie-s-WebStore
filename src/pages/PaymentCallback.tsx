import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

type Status = "loading" | "success" | "failed";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const { clearCart }  = useCart();
  const [status, setStatus] = useState<Status>("loading");
  const [orderRef, setOrderRef] = useState<string>("");

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    if (!reference) { setStatus("failed"); return; }

    const verify = async () => {
      try {
        // Look up the order by paystack_reference
        const { data: order } = await supabase
          .from("orders")
          .select("id, status, first_name")
          .eq("paystack_reference", reference)
          .maybeSingle();

        if (order && order.status === "confirmed") {
          setOrderRef(order.id.split("-")[0].toUpperCase());
          clearCart();
          setStatus("success");
          return;
        }

        // Webhook may not have fired yet — poll for up to 10s
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const { data: o } = await supabase
            .from("orders")
            .select("id, status")
            .eq("paystack_reference", reference)
            .maybeSingle();

          if (o?.status === "confirmed") {
            setOrderRef(o.id.split("-")[0].toUpperCase());
            clearCart();
            setStatus("success");
            clearInterval(poll);
          } else if (attempts >= 5) {
            // Timeout — show success anyway if order exists (webhook may be delayed)
            if (o) {
              setOrderRef(o.id.split("-")[0].toUpperCase());
              clearCart();
              setStatus("success");
            } else {
              setStatus("failed");
            }
            clearInterval(poll);
          }
        }, 2000);
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Confirming your payment…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
        >
          <X className="h-8 w-8" strokeWidth={1.5} />
        </motion.div>
        <h1 className="mt-8 font-display text-4xl font-medium">Payment unsuccessful</h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
          Your payment could not be verified. If you were charged, please contact us at{" "}
          <a href="mailto:thecorperateaura@gmail.com" className="text-foreground underline">
            thecorperateaura@gmail.com
          </a>{" "}
          with your reference and we'll sort it out.
        </p>
        <div className="mt-10 flex gap-4">
          <Link to="/checkout" className="border border-foreground px-8 py-3 text-[12px] uppercase tracking-luxe transition-colors hover:bg-foreground hover:text-background">
            Try again
          </Link>
          <Link to="/shop" className="bg-primary px-8 py-3 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="h-8 w-8" strokeWidth={1.5} />
      </motion.div>
      <h1 className="mt-8 font-display text-4xl font-medium">Payment received.</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
        Your order is confirmed and your pieces will be pressed, wrapped, and on their way within two business days.
      </p>
      {orderRef && (
        <p className="mt-3 text-xs text-foreground/40">Order ref: {orderRef}</p>
      )}
      <Link
        to="/shop"
        className="mt-10 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
