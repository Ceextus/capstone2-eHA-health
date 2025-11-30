import {
    useState,
    useEffect
} from 'react';

const STORAGE_KEY = 'auth_user';
const DEFAULT_CREDENTIALS = {
    email: 'admin@hospital.com',
    password: '123456'
};

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from memory on mount
    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    // Get user from memory
    const getStoredUser = () => {
        try {
            const data = sessionStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading user data:', error);
            return null;
        }
    };

    // Save user to memory
    const saveUser = (userData) => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    // Remove user from memory
    const removeUser = () => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user data:', error);
        }
    };

    // Login function
    const login = (email, password) => {
        if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
            const userData = {
                email: email,
                name: 'Admin User',
                role: 'Administrator',
                loginTime: new Date().toISOString()
            };

            saveUser(userData);
            setUser(userData);
            return {
                success: true,
                message: 'Login successful'
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    };

    // Logout function
    const logout = () => {
        removeUser();
        setUser(null);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    // Get current user
    const getUser = () => {
        return user;
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        getUser
    };
};

export default useAuth;