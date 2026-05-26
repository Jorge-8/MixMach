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
            credentials: 'include', // permitir que el navegador reciba y guarde la cookie Set-Cookie
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

        document.cookie = `access_token=${result.access}; path=/; SameSite=Lax`;

        localStorage.setItem('accessToken', result.access);
        localStorage.setItem('refreshToken', result.refresh);
        if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        // Marca sesión activa para control del frontend
        localStorage.setItem('isLoggedIn', 'true');

        return result;
    },
    
    async register(data: RegisterData): Promise<AuthResponse> {
        // Paso 1: Enviar datos y recibir código
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

    async verifyEmail(email: string, code: string): Promise<AuthResponse> {
        // Paso 2: Enviar código de verificación
        const response = await fetch(`${API_BASE_URL}/verify-email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                code: code,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                Object.values(error).join(', ') || 'Error en verificación'
            );
        }

        return await response.json();
    },

    logout() {
        document.cookie = 'access_token=; path=/; max-age=0';
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
    },

    handleUnauthorized() {
        this.logout();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
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