import axios from 'axios';
import { getSession } from '@/app/utils/session';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, { email, password });
        if (response.data.success) {
            return response.data;
        }
        throw new Error('Login failed');
    }  catch (err) {
        console.error(err); // Logs the error for debugging purposes
      }
};

export const getUserInfo = async () => {
    try {
        const session = getSession(); // Retrieve token from session
        if (!session || !session.token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
            headers: {
                Authorization: `Bearer ${session.token}`,
            },
        });

        return response.data; // Return user information
    } catch (err) {
        console.error(err); // Logs the error for debugging purposes
      }
};