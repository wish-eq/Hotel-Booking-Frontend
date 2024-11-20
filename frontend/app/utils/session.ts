import Cookies from 'js-cookie';

export const setSession = (data: { _id: string; name: string; email: string; token: string }) => {
    Cookies.set('session', JSON.stringify(data), { expires: 7 }); // Save for 7 days
};

export const getSession = () => {
    const session = Cookies.get('session');
    return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
    Cookies.remove('session');
};
