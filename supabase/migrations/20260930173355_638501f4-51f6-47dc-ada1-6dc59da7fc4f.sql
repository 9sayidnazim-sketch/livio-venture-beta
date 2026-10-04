CREATE TYPE public.app_role AS ENUM ('student', 'admin', 'counsellor');
CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 role public.app_role NOT NULL DEFAULT 'student',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE TABLE public.student_profiles (
 user_id uuid PRIMARY KEY,
 full_name text NOT NULL,
 email text NOT NULL,
 phone text NOT NULL,
 city text NOT NULL,
 country text NOT NULL,
 subject text NOT NULL,
 score numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
 qualification text NOT NULL,
 level text NOT NULL CHECK (level IN ('UG','PG')),
 yearly_budget numeric(12,2) NOT NULL CHECK (yearly_budget > 0),
 ielts_score numeric(3,1) CHECK (ielts_score BETWEEN 0 AND 9),
 preferred_countries text[] NOT NULL DEFAULT '{}',
 consent_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO authenticated;
GRANT ALL ON public.student_profiles TO service_role;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Create own profile" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own profile" ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete own profile" ON public.student_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER touch_student_profiles BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_user_roles BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();