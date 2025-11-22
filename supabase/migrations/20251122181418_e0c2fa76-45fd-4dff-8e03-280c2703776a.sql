-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can read their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update admin_notifications policies to require admin role
DROP POLICY IF EXISTS "Anyone can read notifications" ON public.admin_notifications;

CREATE POLICY "Admins can read notifications"
  ON public.admin_notifications
  FOR SELECT
  TO authenticated
  USING (public.has_admin_role(auth.uid()));

CREATE POLICY "Admins can delete notifications"
  ON public.admin_notifications
  FOR DELETE
  TO authenticated
  USING (public.has_admin_role(auth.uid()));

-- Update quiz_submissions policies for admin
CREATE POLICY "Admins can view all submissions"
  ON public.quiz_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_admin_role(auth.uid()));

CREATE POLICY "Admins can delete submissions"
  ON public.quiz_submissions
  FOR DELETE
  TO authenticated
  USING (public.has_admin_role(auth.uid()));

-- Update student registrations for admin
CREATE POLICY "Admins can view all registrations"
  ON public.student_registrations
  FOR SELECT
  TO authenticated
  USING (public.has_admin_role(auth.uid()));

CREATE POLICY "Admins can delete registrations"
  ON public.student_registrations
  FOR DELETE
  TO authenticated
  USING (public.has_admin_role(auth.uid()));