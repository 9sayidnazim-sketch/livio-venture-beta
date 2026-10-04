CREATE TABLE public.universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, country text NOT NULL, city text NOT NULL,
  fields text[] NOT NULL DEFAULT '{}', levels text[] NOT NULL DEFAULT '{}',
  tuition_eur numeric NOT NULL, living_eur numeric NOT NULL,
  min_score numeric NOT NULL DEFAULT 60, min_ielts numeric NOT NULL DEFAULT 6,
  intakes text[] NOT NULL DEFAULT '{}', language text NOT NULL DEFAULT 'English',
  description text NOT NULL DEFAULT '', website text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.universities TO authenticated; GRANT ALL ON public.universities TO service_role;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in read catalogue" ON public.universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage catalogue" ON public.universities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
GRANT INSERT, UPDATE, DELETE ON public.universities TO authenticated;

CREATE TABLE public.saved_universities (
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  university_id uuid NOT NULL REFERENCES public.universities ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, university_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_universities TO authenticated; GRANT ALL ON public.saved_universities TO service_role;
ALTER TABLE public.saved_universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved" ON public.saved_universities FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TYPE public.application_status AS ENUM ('draft','submitted','under_review','offer','accepted','rejected','withdrawn');
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  university_id uuid NOT NULL REFERENCES public.universities ON DELETE CASCADE,
  program text NOT NULL, intake text NOT NULL,
  status public.application_status NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, university_id, program)
);
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated; GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own apps" ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counsellor'));
CREATE POLICY "Create own apps" ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'submitted');
CREATE POLICY "Staff update apps" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counsellor'));
CREATE TRIGGER applications_touch BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.application_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications ON DELETE CASCADE,
  status public.application_status NOT NULL, note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.application_events TO authenticated; GRANT ALL ON public.application_events TO service_role;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own events" ON public.application_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counsellor'))));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL, body text NOT NULL DEFAULT '', link text,
  read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated; GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own notifs" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Mark own notifs" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete own notifs" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.on_application_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uname text;
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO application_events(application_id, status) VALUES (NEW.id, NEW.status);
    SELECT name INTO uname FROM universities WHERE id = NEW.university_id;
    INSERT INTO notifications(user_id, title, body, link) VALUES (NEW.user_id,
      CASE WHEN TG_OP='INSERT' THEN 'Application submitted' ELSE 'Application updated' END,
      uname || ' — ' || replace(NEW.status::text,'_',' '), '/app/applications/' || NEW.id);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER applications_events AFTER INSERT OR UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.on_application_change();

CREATE TYPE public.document_status AS ENUM ('uploaded','in_review','approved','needs_changes');
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  application_id uuid REFERENCES public.applications ON DELETE SET NULL,
  kind text NOT NULL, file_name text NOT NULL, storage_path text NOT NULL,
  status public.document_status NOT NULL DEFAULT 'uploaded', reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated; GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own docs" ON public.documents FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counsellor'));
CREATE POLICY "Add own docs" ON public.documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'uploaded');
CREATE POLICY "Delete own docs" ON public.documents FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Staff review docs" ON public.documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'counsellor'));
CREATE TRIGGER documents_touch BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.counsellors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, phone text, languages text[] NOT NULL DEFAULT '{}', bio text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.counsellor_assignments (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  counsellor_id uuid NOT NULL REFERENCES public.counsellors ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.counsellors, public.counsellor_assignments TO authenticated;
GRANT ALL ON public.counsellors, public.counsellor_assignments TO service_role;
ALTER TABLE public.counsellors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read assigned counsellor" ON public.counsellors FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.counsellor_assignments ca WHERE ca.counsellor_id = id AND ca.user_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Read own assignment" ON public.counsellor_assignments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));


CREATE POLICY "Own doc files read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Own doc files insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Own doc files delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);

INSERT INTO public.universities (name,country,city,fields,levels,tuition_eur,living_eur,min_score,min_ielts,intakes,description) VALUES
('Technical University of Munich','Germany','Munich','{Engineering,Computer Science,Business}','{UG,PG}',0,13000,80,6.5,'{Winter,Summer}','Public research university with strong engineering programmes.'),
('Humboldt University of Berlin','Germany','Berlin','{Humanities,Law,Economics}','{UG,PG}',0,11500,75,6.5,'{Winter}','Public university in central Berlin.'),
('University of Amsterdam','Netherlands','Amsterdam','{Business,Psychology,Computer Science}','{UG,PG}',14500,14000,75,6.5,'{September}','Large research university with many English-taught programmes.'),
('Delft University of Technology','Netherlands','Delft','{Engineering,Architecture,Computer Science}','{UG,PG}',16500,12500,80,6.5,'{September}','Technical university known for engineering and design.'),
('KU Leuven','Belgium','Leuven','{Medicine,Engineering,Law}','{UG,PG}',4200,11000,75,6.5,'{September}','Historic Belgian research university.'),
('Sorbonne University','France','Paris','{Science,Medicine,Humanities}','{UG,PG}',3800,14500,70,6.0,'{September}','Multidisciplinary university in Paris.'),
('Politecnico di Milano','Italy','Milan','{Engineering,Architecture,Design}','{UG,PG}',3900,12000,70,6.0,'{September,February}','Leading Italian technical university.'),
('University of Bologna','Italy','Bologna','{Economics,Law,Medicine}','{UG,PG}',3000,10000,65,6.0,'{September}','One of the oldest universities in Europe.'),
('Trinity College Dublin','Ireland','Dublin','{Business,Computer Science,Law}','{UG,PG}',22000,15000,75,6.5,'{September}','Ireland''s oldest university.'),
('University of Barcelona','Spain','Barcelona','{Business,Medicine,Humanities}','{UG,PG}',5500,11000,65,6.0,'{September}','Large public university in Barcelona.'),
('Lund University','Sweden','Lund','{Engineering,Business,Science}','{UG,PG}',15000,11000,75,6.5,'{August,January}','Swedish research university.'),
('University of Vienna','Austria','Vienna','{Humanities,Science,Business}','{UG,PG}',1500,11500,65,6.0,'{October,March}','Austria''s largest university.'),
('Charles University','Czech Republic','Prague','{Medicine,Science,Humanities}','{UG,PG}',9000,8500,65,6.0,'{September}','Central European university in Prague.'),
('University of Warsaw','Poland','Warsaw','{Economics,Computer Science,Humanities}','{UG,PG}',4000,7500,60,5.5,'{October}','Poland''s largest university.');