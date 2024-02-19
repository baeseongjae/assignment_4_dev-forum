export interface User {
  id: number;
  email: string;
  encryptedPassword: string;
  createdAt: Date;
  profile: UserProfile | null;
}

export interface UserProfile {
  id: number;
  nickname: string | null;
  name: string | null;
  gender: string | null;
  age: number | null;
}

export interface ErrorResponse {
  error: string;
}
