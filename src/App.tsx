import  { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CameraComponent from './components/Camera';
import InvalidSession from './components/InvalidSession';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 120000); // 2 minutes

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path="/" element={token ? <CameraComponent /> : <InvalidSession />} />
    </Routes>
  );
};

export default App;
