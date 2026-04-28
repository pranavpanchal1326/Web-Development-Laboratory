import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, Percent, ArrowRight, Bell, User, Settings, LogOut } from 'lucide-react';

// To run this:
// 1. Make sure you have a running React + Tailwind CSS project.
// 2. Create a new file in your `src/pages/` folder called `StudentDashboard.jsx`.
// 3. Paste this entire code into that file.
// 4. In your `App.jsx`, import this component and render it.
//    (e.g., import StudentDashboard from './pages/StudentDashboard'; ... return <StudentDashboard />;)


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

const SubjectRow = ({ subject }) => {
    const percentage = Math.round((subject.attended / subject.total) * 100);
    let progressBarColor = 'bg-green-500';
    if (percentage < 75) progressBarColor = 'bg-red-500';
    else if (percentage < 85) progressBarColor = 'bg-yellow-500';

    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-3 transition-all hover:bg-gray-100 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="font-bold text-gray-800">{subject.name}</p>
                    <p className="text-xs text-gray-500">{subject.code}</p>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-xl ${percentage < 75 ? 'text-red-500' : 'text-gray-800'}`}>{percentage}%</p>
                    <p className="text-xs text-gray-500">{`${subject.attended}/${subject.total} classes`}</p>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

// --- Main Student Dashboard Component ---

export default function StudentDashboard() {
    // --- STATE MANAGEMENT ---
    // We now use React's state to hold the dashboard data.
    // This makes the component dynamic and ready for real data.
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- DATA FETCHING SIMULATION ---
    // This `useEffect` hook simulates fetching data from a backend like Firebase.
    // When the component first loads, it waits 1.5 seconds then sets the data.
    useEffect(() => {
        const fetchMockData = () => {
            const mockData = {
                name: "Priya Sharma",
                enrollmentId: "C210045",
                overallAttendance: 82,
                subjects: [
                    { name: "Web Technology", code: "CS301", attended: 25, total: 30 },
                    { name: "Database Systems", code: "CS302", attended: 28, total: 32 },
                    { name: "Theory of Computation", code: "CS303", attended: 22, total: 28 },
                    { name: "Software Engineering", code: "SE304", attended: 30, total: 30 },
                    { name: "Artificial Intelligence", code: "AI305", attended: 18, total: 25 },
                ],
                notifications: [
                    { id: 1, text: "Your attendance in AI is low. Please consult your faculty advisor.", type: "warning" },
                    { id: 2, text: "Leave application for 12/08/25 has been approved.", type: "info" },
                ]
            };
            
            setTimeout(() => {
                setStudentData(mockData);
                setLoading(false);
            }, 1500); // Simulate network delay
        };

        fetchMockData();
    }, []); // The empty array [] means this effect runs only once on component mount.

    // --- LOADING STATE ---
    // Display a loading message while data is being "fetched".
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading Dashboard...</p>
            </div>
        );
    }
    
    // --- RENDERED COMPONENT ---
    // This part of the code will only run once `studentData` is available.
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
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="hidden md:block text-sm font-medium">{studentData.name}</span>
                            </button>
                             <button className="p-2 rounded-full hover:bg-red-100 text-red-500">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back, {studentData.name.split(' ')[0]}!</h2>
                    <p className="text-gray-500">Here is your attendance summary for this semester.</p>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Overall Attendance" 
                        value={`${studentData.overallAttendance}%`} 
                        icon={<Percent className="text-white" />} 
                        colorClass="bg-purple-500"
                    />
                    <StatCard 
                        title="Highest Attendance" 
                        value="100%" 
                        icon={<CheckCircle className="text-white" />} 
                        colorClass="bg-green-500"
                    />
                    <StatCard 
                        title="Lowest Attendance" 
                        value="72%" 
                        icon={<XCircle className="text-white" />} 
                        colorClass="bg-red-500"
                    />
                </div>

                {/* Subject-wise Attendance & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Subject-wise Attendance</h3>
                            <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center">
                                View Detailed Report <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div>
                            {studentData.subjects.map(subject => (
                                <SubjectRow key={subject.code} subject={subject} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {studentData.notifications.map(notif => (
                                <div key={notif.id} className={`p-4 rounded-lg ${notif.type === 'warning' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                    <p className="text-sm font-medium">{notif.text}</p>
                                </div>
                            ))}
                             <button className="w-full mt-4 bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                                Apply for Leave
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
