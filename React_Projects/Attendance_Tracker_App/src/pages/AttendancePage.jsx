import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Search, Check, X, Users } from 'lucide-react';

// To run this:
// 1. Create a new file in your `src/pages/` folder called `AttendancePage.jsx`.
// 2. Paste this entire code into that file.
// 3. This page would be shown when a faculty clicks "Take Attendance" on the dashboard.

// --- MOCK DATA (This would come from your Firebase backend) ---
const classDetails = {
    name: "Web Technology",
    code: "CS301",
    faculty: "Dr. Anil Kumar",
    students: [
        { id: "C210001", name: "Aarav Patel" },
        { id: "C210002", name: "Aditi Sharma" },
        { id: "C210003", name: "Arjun Reddy" },
        { id: "C210004", name: "Diya Singh" },
        { id: "C210005", name: "Ishaan Gupta" },
        { id: "C210006", name: "Kavya Mishra" },
        { id: "C210007", name: "Mohammed Khan" },
        { id: "C210008", name: "Neha Verma" },
        { id: "C210009", name: "Rohan Joshi" },
        { id: "C210010", name: "Saanvi Kumar" },
        // ... more students
    ]
};

// --- Reusable Sub-Components ---
const StudentRow = ({ student, status, onStatusChange }) => {
    const isPresent = status === 'present';
    const isAbsent = status === 'absent';

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.id}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button 
                    onClick={() => onStatusChange(student.id, 'present')}
                    className={`p-2 rounded-full transition-colors ${isPresent ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-green-100'}`}
                >
                    <Check className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onStatusChange(student.id, 'absent')}
                    className={`p-2 rounded-full transition-colors ${isAbsent ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-red-100'}`}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


// --- Main Attendance Page Component ---
export default function AttendancePage() {
    // State to hold the attendance status for each student
    const [attendance, setAttendance] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // Initialize attendance state when component loads
    useEffect(() => {
        const initialStatus = {};
        classDetails.students.forEach(student => {
            initialStatus[student.id] = 'present'; // Default to 'present'
        });
        setAttendance(initialStatus);
    }, []);

    const handleStatusChange = (studentId, newStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: newStatus }));
    };

    const markAll = (status) => {
        const newAttendance = {};
        classDetails.students.forEach(student => {
            newAttendance[student.id] = status;
        });
        setAttendance(newAttendance);
    };

    const filteredStudents = classDetails.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button className="flex items-center text-purple-600 font-medium">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Dashboard
                        </button>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-gray-800">{classDetails.name}</h1>
                            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="w-36"></div> {/* Spacer */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary & Controls */}
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 sticky top-20 z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <p className="text-sm font-medium text-blue-600">Total Students</p>
                            <p className="text-2xl font-bold text-blue-800">{classDetails.students.length}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-green-50">
                            <p className="text-sm font-medium text-green-600">Present</p>
                            <p className="text-2xl font-bold text-green-800">{presentCount}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-red-50">
                            <p className="text-sm font-medium text-red-600">Absent</p>
                            <p className="text-2xl font-bold text-red-800">{absentCount}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-50">
                            <p className="text-sm font-medium text-gray-600">Unmarked</p>
                            <p className="text-2xl font-bold text-gray-800">0</p>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-2 mt-4">
                        <button onClick={() => markAll('present')} className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Mark All Present</button>
                        <button onClick={() => markAll('absent')} className="text-xs font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">Mark All Absent</button>
                    </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    <div>
                        {filteredStudents.map(student => (
                            <StudentRow 
                                key={student.id} 
                                student={student}
                                status={attendance[student.id]}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-purple-700 transition-colors shadow-lg">
                        Submit Attendance
                    </button>
                </div>
            </main>
        </div>
    );
}
