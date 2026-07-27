import { useAuth } from './context/AuthContext';
import { BurgersProvider } from './context/BurgersContext';
import { LoginPage } from './pages/LoginPage';
import { BuilderPage } from './pages/BuilderPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BurgersProvider>
      <BuilderPage />
    </BurgersProvider>
  );
}
