export type Opportunite = {
  id: string | number;
  name: string;
  state: string;
  city: string;
  salary: string;
  home_office: boolean | undefined | null;
  hybrid: boolean | undefined | null;
  published_at: string;
  url: string;
};
