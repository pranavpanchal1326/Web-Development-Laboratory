import React, { useState, useEffect } from 'react';
import { Users, BarChart3, UserCheck, UserX, ArrowRight, Bell, Settings, LogOut } from 'lucide-react';

// To run this:
// 1. Create a new file in your `src/pages/` folder called `StaffDashboard.jsx`.
// 2. Paste this entire code into that file.
// 3. In your `App.jsx`, you would conditionally render this dashboard if the logged-in user's role is 'faculty'.

// --- MOCK DATA (This would come from your Firebase backend) ---
const facultyData = {
    name: "Dr. Anil Kumar",
    department: "Computer Science & Engineering",
    classes: [
        { name: "Web Technology", code: "CS301", year: "Third Year", students: 65 },
        { name: "Database Systems", code: "CS302", year: "Third Year", students: 68 },
        { name: "Compiler Design", code: "CS401", year: "Final Year", students: 62 },
    ],
    summary: {
        totalStudents: 195,
        lowAttendanceCount: 12,
    }
};

// --- Reusable Sub-Components ---

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ClassCard = ({ classInfo }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:scale-105">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-xl text-gray-800">{classInfo.name}</p>
                <p className="text-sm text-gray-500">{classInfo.code} - {classInfo.year}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{classInfo.students}</p>
                <p className="text-xs text-gray-500">Students</p>
            </div>
        </div>
        <button className="w-full mt-6 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
            Take Attendance <ArrowRight className="w-5 h-5 ml-2" />
        </button>
    </div>
);


// --- Main Faculty Dashboard Component ---

export default function StaffDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate fetching data from a backend
    useEffect(() => {
        setTimeout(() => {
            setDashboardData(facultyData);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading Faculty Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src="https://placehold.co/40x40/7c3aed/ffffff?text=P" alt="PresencePro Logo" className="rounded-lg"/>
                            <h1 className="text-xl font-bold text-gray-800 ml-3">PresencePro</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full hover:bg-gray-100"><Bell className="w-5 h-5 text-gray-600" /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100"><Settings className="w-5 h-5 text-gray-600" /></button>
                            <span className="hidden md:block text-sm font-medium">{dashboardData.name}</span>
                            <button className="p-2 rounded-full hover:bg-red-100 text-red-500"><LogOut className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Faculty Dashboard</h2>
                    <p className="text-gray-500">Welcome, {dashboardData.name}. Manage your classes and attendance here.</p>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Total Students" 
                        value={dashboardData.summary.totalStudents} 
                        icon={<Users className="text-white" />} 
                        colorClass="bg-blue-500"
                    />
                    <StatCard 
                        title="Assigned Classes" 
                        value={dashboardData.classes.length} 
                        icon={<BarChart3 className="text-white" />} 
                        colorClass="bg-green-500"
                    />
                    <StatCard 
                        title="Low Attendance" 
                        value={dashboardData.summary.lowAttendanceCount} 
                        icon={<UserX className="text-white" />} 
                        colorClass="bg-red-500"
                    />
                </div>

                {/* Class List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Your Classes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.classes.map(classInfo => (
                            <ClassCard key={classInfo.code} classInfo={classInfo} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
