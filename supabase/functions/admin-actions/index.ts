import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Missing env vars:", { hasUrl: !!supabaseUrl, hasAnon: !!anonKey, hasService: !!serviceRoleKey });
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: corsHeaders });
    }

    // Validate JWT using getClaims
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claimsData.claims.sub;

    // Admin client with service role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check admin role
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), { status: 403, headers: corsHeaders });
    }

    const { action, ...params } = await req.json();

    let result: any;

    switch (action) {
      case "list_users": {
        const { data, error } = await adminClient.from("profiles").select("*");
        if (error) throw error;
        result = data;
        break;
      }

      case "update_balance": {
        const { user_id, field, amount } = params;
        if (!["checking_balance", "savings_balance"].includes(field)) throw new Error("Invalid field");
        const { data: profile } = await adminClient.from("profiles").select(field).eq("user_id", user_id).single();
        if (!profile) throw new Error("User not found");
        const newBalance = Number(profile[field]) + Number(amount);
        const { error } = await adminClient.from("profiles").update({ [field]: newBalance }).eq("user_id", user_id);
        if (error) throw error;
        result = { success: true, newBalance };
        break;
      }

      case "set_balance": {
        const { user_id, field, amount } = params;
        if (!["checking_balance", "savings_balance"].includes(field)) throw new Error("Invalid field");
        const { error } = await adminClient.from("profiles").update({ [field]: Number(amount) }).eq("user_id", user_id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "set_transfer_fee": {
        const { user_id, fee } = params;
        const { error } = await adminClient.from("profiles").update({ transfer_fee: Number(fee) }).eq("user_id", user_id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "toggle_block": {
        const { user_id, blocked } = params;
        const { error } = await adminClient.from("profiles").update({ is_blocked: !!blocked }).eq("user_id", user_id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "list_transactions": {
        const { user_id } = params;
        const query = adminClient.from("transactions").select("*").order("created_at", { ascending: false });
        if (user_id) query.eq("user_id", user_id);
        const { data, error } = await query.limit(200);
        if (error) throw error;
        result = data;
        break;
      }

      case "update_transaction": {
        const { id, updates } = params;
        const { error } = await adminClient.from("transactions").update(updates).eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_transaction": {
        const { id } = params;
        const { error } = await adminClient.from("transactions").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      default:
        throw new Error("Unknown action: " + action);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const status = err.message?.includes("Forbidden") ? 403 : err.message?.includes("Unauthorized") ? 401 : 400;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
