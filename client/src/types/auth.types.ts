export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales_user';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
}
