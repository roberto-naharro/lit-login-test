export interface LoginResult {
  statusCode: number;
  error?: {
    email: string;
    password: string;
  };
}
