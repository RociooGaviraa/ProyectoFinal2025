import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EventProvider } from './contexts/EventContext.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "events/:id",
                element: <EventDetails />,
            },
            {
                path: "create-event",
                element: <CreateEvent />,
            },
            {
                path: "profile",
                element: <UserProfile />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            }
        ],
    },
]);

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