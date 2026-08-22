# Run after: supabase login
# Project ref: aggvtuokucponclcqlmg
#
# Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically
# by Supabase into Edge Functions — do NOT set them with secrets set.

supabase link --project-ref aggvtuokucponclcqlmg

supabase db push

supabase secrets set SITE_URL=http://localhost:3000

supabase functions deploy admin-login
supabase functions deploy admin-me
supabase functions deploy get-availability
supabase functions deploy create-booking
supabase functions deploy admin-api
supabase functions deploy submit-review
supabase functions deploy subscribe-newsletter
