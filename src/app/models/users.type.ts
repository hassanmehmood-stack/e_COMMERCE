export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}