import { RouterProvider } from 'react-router-dom';
import { EventProvider } from './contexts/EventContext.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "sonner";
import { router } from './router/routes';

function App() {
    return (
        <AuthProvider>
            <EventProvider>
                <RouterProvider router={router} />
                <Toaster />
            </EventProvider>
        </AuthProvider>
    );
}

export default App;