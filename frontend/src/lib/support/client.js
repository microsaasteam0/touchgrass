import React from 'react';
  
 
  import { createSupportClient } from "@entrext/support-client";

export const supportClient = createSupportClient({
  endpoint: "https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support",
  anonKey: import.meta.env.VITE_SUPPORT_ANON_KEY || "sb_publishable_jgtstX7UhO85Bkf1qbFUMA_jkSWPo0Q"
});