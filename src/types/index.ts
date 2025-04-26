export type Project = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'completed';
    investment_goal: number;
    investment_received: number;
    created_at: string;
  };
  
  export type Investment = {
    id: string;
    project_id: string;
    investor_id: string;
    amount: number;
    created_at: string;
  };
  
  export type User = {
    id: string;
    email: string;
    role: 'investor' | 'owner';
    created_at: string;
  };
  