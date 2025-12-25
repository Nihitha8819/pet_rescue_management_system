import React, { createContext, useState, useContext, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export { NotificationContext };

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [user]);

    const addNotification = (notification) => {
    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) => 
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

  const markAsRead = async (id) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
    } catch (e) {
      console.error('Failed to mark notification as read', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error('Failed to mark all notifications read', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
        unreadCount,
        loading,
                addNotification,
                removeNotification,
                clearNotifications,
        markAsRead,
        markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};