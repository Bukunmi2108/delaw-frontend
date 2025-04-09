import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  import { useNavigate } from 'react-router-dom';
  import apiService from '../api/api'; // Assuming your apiService is in src/api/api.ts
  
  interface AuthContextType {
    isAuthenticated: boolean;
    login: (formData: any) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
  }
  
  const AuthContext = createContext<AuthContextType | null>(null);
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await apiService.getUser();
          if (user) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.error('Authentication check failed:', error);
        } finally {
          setLoading(false);
        }
      };
  
      checkAuth();
    }, []);
    
    const login = async (formData: any) => {
      apiService
        .login(formData)
        .then((response) => {
          if (response && response.access_token) {
            console.log('Login successful:', response);
            navigate('/chat')
            setIsAuthenticated(true);
          } else {
            alert('Login failed');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
        });
    }

    const logout = async () => {
      try {
        await apiService.logout(); // Replace with your actual logout call
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login after logout
      }
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };