import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes';

function App() {
  return (
    <GoogleOAuthProvider clientId="767450657361-c1arvbqpisqt92qpcf4596gkc6rsqbij.apps.googleusercontent.com">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;