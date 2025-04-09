import { useEffect, useState } from 'react';
import { Chat, Document, Login, Signup } from './pages'; // Assuming your pages are in src/pages
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import { ProtectedRoute } from './auth/protectedRoute';

function App() {
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chat windowSize={windowSize} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat windowSize={windowSize} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <Chat windowSize={windowSize} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <Document windowSize={windowSize} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document"
            element={
              <ProtectedRoute>
                <Document windowSize={windowSize}/>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login windowSize={windowSize} />} />
          <Route path="/register" element={<Signup windowSize={windowSize} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;