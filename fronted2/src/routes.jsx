import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Events from "./pages/Events";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "events",
                element: <Events />,
            },
            {
                path: "events/category/:category",
                element: <Events />,
            }
        ],
    },
]);