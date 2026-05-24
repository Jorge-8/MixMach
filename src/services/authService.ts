import { register } from "module";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface LoginData {
    email:string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    access: string;
    refresh: string;
    user?: {
        id: number;
        email: string;
        name: string;
    };
    message: string;
}

export const authService = {

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error en login');
        }

        const result = await response.json();
        localStorage.setItem('accessToken', result.access);
        localStorage.setItem('refreshToken', result.refresh);

        if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    },
    
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                first_name: data.name,
                password: data.password,
            }),
        });


        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                Object.values(error).join(', ') || 'Error en registro'
            );
        }

        return await response.json();
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user): null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    },

};