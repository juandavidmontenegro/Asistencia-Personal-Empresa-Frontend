import { User } from "./auth-login.interface";

export interface AuthResponse {
    user: User;
    token: string;
}