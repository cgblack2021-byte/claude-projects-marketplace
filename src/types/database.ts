export type Profile = {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  thumbnail_url: string | null;
  price_cents: number;
  currency: string;
  summary: string;
  marketing_plan_preview: string;
  marketing_plan_full: string;
  deliverable_path: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  project_id: string;
  stripe_session_id: string | null;
  amount_cents: number;
  status: string;
  created_at: string;
};
