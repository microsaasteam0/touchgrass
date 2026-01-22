import { createClient } from '@supabase/supabase-js';

// Get from environment variables (Vite uses import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkrwoidwisbwktndxoca.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5FSk7Tu-7fl5SAnY6qevkQ__RLYoC48';

// Check if using environment variables or fallback values
const isConfigured = (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
                     (!supabaseUrl.includes('YOUR_PROJECT') && !supabaseAnonKey.includes('YOUR_ANON'));

if (!isConfigured && typeof window !== 'undefined') {
  console.error('❌❌❌ SUPABASE NOT CONFIGURED ❌❌❌');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');

  // Don't block the app, but show warning
  setTimeout(() => {
    if (window.location.pathname === '/') {
      alert(
        '⚠️ Supabase Configuration Required\n\n' +
        'Please set these environment variables:\n' +
        'VITE_SUPABASE_URL=your_project_url\n' +
        'VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
        'Get values from: Supabase Dashboard → Settings → API\n\n' +
        'Without this, Google OAuth will not work.'
      );
    }
  }, 2000);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
  },
});

// Export for debugging
if (typeof window !== 'undefined') {
  window._supabase = supabase;
}