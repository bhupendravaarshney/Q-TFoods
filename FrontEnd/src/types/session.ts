export type ErpContext = {
  company_id: string;
  company_name: string;
  plant_id: string | null;
  plant_name: string | null;
};

export type ErpUser = {
  id: string;
  name: string;
  email: string;
};

export type ErpSession = {
  user: ErpUser;
  roles: string[];
  allowed_screens: string[];
  allowed_actions: string[];
  contexts: ErpContext[];
  selected_context: ErpContext | null;
};
