-- Create enum for result status
CREATE TYPE result_status AS ENUM ('pending', 'available');

-- Student registrations table
CREATE TABLE public.student_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  registration_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz submissions table
CREATE TABLE public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT NOT NULL REFERENCES public.student_registrations(registration_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  results_visible_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status result_status DEFAULT 'pending'
);

-- Quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

-- Admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  registration_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_registrations (public read/write for students)
CREATE POLICY "Anyone can insert registrations"
  ON public.student_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own registration"
  ON public.student_registrations
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for quiz_submissions (public can insert, read their own)
CREATE POLICY "Anyone can submit quiz"
  ON public.quiz_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Students can view their own submissions"
  ON public.quiz_submissions
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for quiz_questions (public read only)
CREATE POLICY "Anyone can read quiz questions"
  ON public.quiz_questions
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for admin_notifications (public can create notifications)
CREATE POLICY "Anyone can create notifications"
  ON public.admin_notifications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read notifications"
  ON public.admin_notifications
  FOR SELECT
  TO public
  USING (true);

-- Function to update result status after 24 hours
CREATE OR REPLACE FUNCTION update_result_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quiz_submissions
  SET status = 'available'
  WHERE results_visible_at <= NOW()
    AND status = 'pending';
END;
$$;

-- Insert sample quiz questions
INSERT INTO public.quiz_questions (question, options, correct_answer, order_index) VALUES
('What is the capital of France?', '["Paris", "London", "Berlin", "Madrid"]', 'Paris', 1),
('Which programming language is known for web development?', '["Python", "JavaScript", "C++", "Java"]', 'JavaScript', 2),
('What is 5 + 7?', '["10", "11", "12", "13"]', '12', 3),
('What is the largest planet in our solar system?', '["Earth", "Mars", "Jupiter", "Saturn"]', 'Jupiter', 4),
('Who painted the Mona Lisa?', '["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"]', 'Da Vinci', 5);