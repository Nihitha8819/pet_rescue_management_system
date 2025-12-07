import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export { NotificationContext };

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) => 
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};