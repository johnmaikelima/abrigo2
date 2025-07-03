export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}
