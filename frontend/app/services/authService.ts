import axios from 'axios';
import { getSession } from '@/app/utils/session';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
        if (response.data.success) {
            return response.data;
        }
        throw new Error('Login failed');
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

export const getUserInfo = async () => {
    try {
        const session = getSession(); // Retrieve token from session
        if (!session || !session.token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: {
                Authorization: `Bearer ${session.token}`,
            },
        });

        return response.data; // Return user information
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user info');
    }
};