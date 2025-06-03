import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import EventList from "../pages/EventList";
import CreateEvent from "../pages/CreateEvent";
import ErrorPage from '../pages/ErrorPage';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserProfile from '../pages/UserProfile';
import AdminPanel from '../pages/AdminPanel';
import UserEventsAdmin from '../pages/UserEventsAdmin';
import ProtectedRoute from '../components/ProtectedRoute';
import Success from '../pages/Success';
import Cancel from '../pages/Cancel';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "events",
                element: <EventList />,
            },
            {
                path: "events/create",
                element: (
                    <ProtectedRoute>
                        <CreateEvent />
                    </ProtectedRoute>
                ),
            },
            {
                path: "events/:id",
                element: <EventDetails />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin-panel",
                element: (
                    <ProtectedRoute adminOnly={true}>
                        <AdminPanel />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/usuarios/:id/eventos",
                element: (
                    <ProtectedRoute adminOnly={true}>
                        <UserEventsAdmin />
                    </ProtectedRoute>
                ),
            },
            {
                path: "success",
                element: <Success />,
            },
            {
                path: "cancel",
                element: <Cancel />,
            },
        ],
    },
]);