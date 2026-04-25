import { createContext, useState } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const GUEST_USER = {
  username: 'guest',
  role: 'user',
  plan: 'free',
};

export const AuthProvider = ({ children }) => {
  const [user] = useState(GUEST_USER);
  const [loading] = useState(false);
  const [otpAttempts] = useState({ remaining: null, limit: null });

  const login = async () => {
    toast.success('Mode gratis aktif. Login tidak diperlukan.', {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
    return { success: true };
  };

  const register = async () => {
    toast.success('Pembuatan akun dinonaktifkan. Gunakan mode gratis.', {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
    return { success: true };
  };

  const verifyRegisterOtp = async () => ({ success: true });
  const sendLoginOtp = async () => ({ success: true });
  const verifyLoginOtp = async () => ({ success: true });

  const logout = async () => {
    toast('Mode gratis selalu aktif.', {
      icon: '🎵',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        otpAttempts,
        login,
        register,
        logout,
        verifyRegisterOtp,
        sendLoginOtp,
        verifyLoginOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
