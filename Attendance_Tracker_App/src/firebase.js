import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Search, Check, X, Users, UploadCloud, XCircle } from 'lucide-react';
// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// --- FIREBASE CONFIGURATION & INITIALIZATION ---
// IMPORTANT: This section fixes the error. 
// Make sure to replace the placeholder values with your actual Firebase config.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// We will initialize Firebase later, after checking if the config is valid.
let app;
let db;
let isFirebaseConfigured = false;

// Only initialize Firebase if the config is valid and not a placeholder
if (firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_")) {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        isFirebaseConfigured = true;
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
}

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

// --- A component to display if Firebase config is missing ---
const FirebaseConfigError = () => (
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800 p-8">
        <div className="text-center max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-red-200">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-3xl font-bold mb-4 text-red-900">Firebase Configuration Missing</h1>
            <p className="text-lg mb-6">
                Please add your Firebase project configuration keys to the `firebaseConfig` object in the code to connect to the backend.
            </p>
        </div>
    </div>
);


// --- Main Attendance Page Component ---
export default function AttendancePage() {
    const [attendance, setAttendance] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const initialStatus = {};
        classDetails.students.forEach(student => {
            initialStatus[student.id] = 'present';
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
    
    const handleSubmit = async () => {
        if (!isFirebaseConfigured) {
            alert("Firebase is not configured. Please add your API keys.");
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        const today = new Date().toISOString().slice(0, 10);
        const recordId = `${classDetails.code}_${today}`;

        try {
            await setDoc(doc(db, "attendanceRecords", recordId), {
                classCode: classDetails.code,
                className: classDetails.name,
                date: today,
                facultyName: classDetails.faculty,
                attendanceData: attendance,
                createdAt: serverTimestamp()
            });
            setSubmitStatus('success');
        } catch (error) {
            console.error("Error submitting attendance: ", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 3000);
        }
    };

    const filteredStudents = classDetails.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

    // If Firebase is not configured, show the error message.
    if (!isFirebaseConfigured) {
        return <FirebaseConfigError />;
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* ... Header and other UI elements ... */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                <div className="mt-8">
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full font-bold py-4 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center disabled:opacity-70 bg-purple-600 text-white hover:bg-purple-700"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                    </button>
                    {submitStatus === 'success' && <p className="text-center mt-2 text-green-600">Submitted Successfully!</p>}
                    {submitStatus === 'error' && <p className="text-center mt-2 text-red-600">Submission Failed. Please try again.</p>}
                </div>
            </main>
        </div>
    );
}
