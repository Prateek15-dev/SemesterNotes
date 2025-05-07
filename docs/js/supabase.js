import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://ikpwcblawncfjgrtktbw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcHdjYmxhd25jZmpncnRrdGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDUxMTQsImV4cCI6MjA2MjAyMTExNH0.F0zJj4J19DoKLMg7YL-s6oBkX18NUPpJEv0SAwsjhQI'

export const supabase = createClient(supabaseUrl, supabaseKey)
