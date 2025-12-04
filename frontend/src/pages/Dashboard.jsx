import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import DashboardHome from '../components/dashboard/DashboardHome';
import MyPets from '../components/dashboard/MyPets';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <DashboardHome />
            <MyPets />
        </div>
    );
};

export default Dashboard;