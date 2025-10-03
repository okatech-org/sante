// deno-lint-ignore-file no-explicit-any
/**
 * Bootstrap Super Admin Function
 * 
 * SECURITY: This function now requires JWT authentication (verify_jwt = true)
 * Credentials come from environment variables, not hardcoded values
 * 
 * For production: Consider removing this function entirely and using
 * manual SQL commands for super admin creation
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// SECURITY: Credentials now come from environment variables
// These should be set via Supabase secrets, not hardcoded
const BOOTSTRAP_EMAIL = Deno.env.get("BOOTSTRAP_ADMIN_EMAIL");
const BOOTSTRAP_PASSWORD = Deno.env.get("BOOTSTRAP_ADMIN_PASSWORD");

if (!BOOTSTRAP_EMAIL || !BOOTSTRAP_PASSWORD) {
  console.warn(
    'Bootstrap credentials not configured. Please set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD secrets.'
  );
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function ensureSuperAdmin() {
  if (!BOOTSTRAP_EMAIL || !BOOTSTRAP_PASSWORD) {
    throw new Error(
      'Bootstrap credentials not configured. Please set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD secrets.'
    );
  }

  console.log(`Checking if super admin exists: ${BOOTSTRAP_EMAIL}`);

  // Always ensure the bootstrap user exists and has the role
  // (idempotent and safe to call multiple times)
  const listRes = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if ((listRes as any).error) throw (listRes as any).error;

  const users = (listRes as any).data?.users ?? [];
  const found = users.find((u: any) => (u.email || "").toLowerCase() === BOOTSTRAP_EMAIL!.toLowerCase());
  let userId: string;

  if (found) {
    userId = found.id;
    // Force-set password and confirm email in case the account was created improperly
    const upd = await admin.auth.admin.updateUserById(userId, {
      password: BOOTSTRAP_PASSWORD,
      email_confirm: true,
    } as any);
    if ((upd as any).error) {
      // If update fails due to invalid state, try delete + recreate
      await admin.auth.admin.deleteUser(userId);
      const recreated = await admin.auth.admin.createUser({
        email: BOOTSTRAP_EMAIL,
        password: BOOTSTRAP_PASSWORD,
        email_confirm: true,
      });
      if ((recreated as any).error) throw (recreated as any).error;
      userId = (recreated as any).data.user.id;
    }
  } else {
    const created = await admin.auth.admin.createUser({
      email: BOOTSTRAP_EMAIL,
      password: BOOTSTRAP_PASSWORD,
      email_confirm: true,
    });
    if ((created as any).error) throw (created as any).error;
    userId = (created as any).data.user.id;
  }

  // 3) Assign the super_admin role (idempotent-ish)
  const { error: insertError } = await admin
    .from("user_roles")
    .insert({ user_id: userId, role: "super_admin" });

  // Ignore unique violation if it exists already
  if (insertError && (insertError as any).code !== "23505") throw insertError;

  return { status: "created", user_id: userId };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Bootstrap super admin function called');
    
    const result = await ensureSuperAdmin();
    const status = result.status === "exists" ? 200 : 201;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: status === 201 
          ? 'Super admin account created successfully' 
          : 'Super admin account already exists',
        user_id: result.user_id
      }), 
      {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (e: any) {
    console.error('Error in bootstrap function:', e);
    
    // SECURITY: Don't expose detailed error messages to clients
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to bootstrap super admin account. Check server logs for details.'
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});