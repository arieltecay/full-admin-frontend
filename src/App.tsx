import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './hooks/use-theme';
import { router } from './routes';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
