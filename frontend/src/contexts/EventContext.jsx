import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    const createEvent = async (eventData) => {
        try {
            // Add event creation logic here
            setEvents([...events, eventData]);
            toast.success('Event created successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to create event');
            throw error;
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            // Add event update logic here
            setEvents(events.map(event => 
                event.id === eventId ? { ...event, ...eventData } : event
            ));
            toast.success('Event updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update event');
            throw error;
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            // Add event deletion logic here
            setEvents(events.filter(event => event.id !== eventId));
            toast.success('Event deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete event');
            throw error;
        }
    };

    return (
        <EventContext.Provider value={{
            events,
            createEvent,
            updateEvent,
            deleteEvent
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};