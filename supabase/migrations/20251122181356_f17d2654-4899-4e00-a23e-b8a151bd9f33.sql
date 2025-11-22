-- Fix function search path security issue
CREATE OR REPLACE FUNCTION update_result_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.quiz_submissions
  SET status = 'available'
  WHERE results_visible_at <= NOW()
    AND status = 'pending';
END;
$$;