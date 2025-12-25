import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import PetList from '../pets/PetList';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const { notifications, fetchNotifications } = useContext(NotificationContext);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <h2 className="text-xl mb-2">Your Notifications</h2>
            <ul className="mb-4">
                {notifications.map(notification => (
                    <li key={notification.id} className={`p-2 ${notification.is_read ? 'bg-gray-200' : 'bg-yellow-200'}`}>
                        {notification.message}
                    </li>
                ))}
            </ul>
            <h2 className="text-xl mb-2">Available Pets</h2>
            <PetList />
        </div>
    );
};

export default DashboardHome;