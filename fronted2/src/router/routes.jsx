import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import EventList from "../pages/EventList";
import CreateEvent from "../pages/CreateEvent";
import ErrorPage from '../pages/ErrorPage';

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
                element: <CreateEvent />,
            },
        ],
    },
]);