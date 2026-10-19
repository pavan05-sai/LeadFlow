import { useState, useEffect, useCallback } from 'react';
import { loginAdmin as loginAPI, getMe } from '../services/api';
import AuthContext from './contextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('crm_token')));

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');

    if (token) {
      getMe()
        .then((res) => {
          const userData = res.data;
          setUser(userData);
          localStorage.setItem('crm_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    localStorage.setItem('crm_token', data.token);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
