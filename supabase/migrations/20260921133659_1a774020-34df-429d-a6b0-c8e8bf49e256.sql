DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('active','trialing','past_due','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS subscription_status public.subscription_status NOT NULL DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS notes text;

UPDATE public.organizations
  SET trial_ends_at = created_at + interval '7 days'
  WHERE trial_ends_at IS NULL;