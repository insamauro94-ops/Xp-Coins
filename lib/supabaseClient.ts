import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vzwosednckegwgkqwkls.supabase.co"
const supabaseKey = "sb_publishable_zdLXmMzpEwCOn7QFtl5ZhQ_DDfyH4tU"

export const supabase = createClient(supabaseUrl, supabaseKey)