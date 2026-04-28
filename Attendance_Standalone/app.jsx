import React, { useState, useEffect, useRef } from 'react';
import { 
    Users, 
    Menu, 
    X, 
    PlayCircle, 
    Clock, 
    BarChart, 
    Smartphone, 
    Shield, 
    Settings, 
    CheckCircle, 
    TrendingUp, 
    BookOpen, 
    Check, 
    Mail, 
    Phone, 
    MapPin, 
    Twitter, 
    Linkedin, 
    Facebook, 
    Instagram,
    UserPlus,
    Lock,
    Eye
} from 'lucide-react';

// To run this:
// 1. Create a new React project: npx create-vite attendance-tracker --template react
// 2. Navigate into the project: cd attendance-tracker
// 3. Install dependencies: npm install
// 4. Install Tailwind CSS & Lucide React: npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p && npm install lucide-react
// 5. Configure tailwind.config.js to include './src/**/*.{js,ts,jsx,tsx}' in the content array.
// 6. Create an index.css file with Tailwind directives: @tailwind base; @tailwind components; @tailwind utilities;
// 7. Import './index.css' in your main.jsx file.
// 8. Replace the content of App.jsx with this code.
// 9. Run the development server: npm run dev

// Note: Custom CSS from the original HTML is included directly in this file for simplicity.

const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body {
        font-family: 'Inter', sans-serif;
    }

    .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .card-hover {
        transition: all 0.3s ease;
    }

    .card-hover:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    .animate-float-delay {
        animation: float 6s ease-in-out infinite;
        animation-delay: 2s;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
  `}</style>
);

// --- Reusable Components ---

const NavLink = ({ href, children, mobile = false, onClick }) => (
    <a 
        href={href} 
        onClick={onClick}
        className={`font-medium transition-colors ${mobile ? 'text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-base rounded-md' : 'text-gray-500 hover:text-blue-600 px-3 py-2 text-sm'}`}
    >
        {children}
    </a>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
        <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const PricingCard = ({ plan, price, description, features, popular = false, onSelect }) => (
    <div className={`bg-white rounded-2xl p-8 shadow-lg card-hover border-2 ${popular ? 'border-blue-500 transform md:scale-105' : 'border-transparent'}`}>
        {popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span>
            </div>
        )}
        <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan}</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">{price}<span className="text-lg text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-8">{description}</p>
            <ul className="space-y-4 text-left mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button onClick={onSelect} className={`w-full py-3 rounded-lg font-semibold transition-colors ${popular ? 'gradient-bg text-white hover:opacity-90' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                Get Started
            </button>
        </div>
    </div>
);


// --- Main Sections as Components ---

const Navbar = ({ onSignIn, onRegister, onLinkClick }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (e, targetId) => {
        e.preventDefault();
        onLinkClick(targetId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white shadow-lg md:bg-transparent md:shadow-none'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <span className="ml-3 text-xl font-bold gradient-text">AttendanceTracker Pro</span>
                            </div>
                            <div className="hidden md:ml-10 md:flex space-x-8">
                                <NavLink href="#home" onClick={(e) => handleLinkClick(e, '#home')}>Home</NavLink>
                                <NavLink href="#features" onClick={(e) => handleLinkClick(e, '#features')}>Features</NavLink>
                                <NavLink href="#dashboard" onClick={(e) => handleLinkClick(e, '#dashboard')}>Dashboard</NavLink>
                                <NavLink href="#pricing" onClick={(e) => handleLinkClick(e, '#pricing')}>Pricing</NavLink>
                                <NavLink href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</NavLink>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={onSignIn} className="hidden md:block text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Sign In</button>
                            <button onClick={onRegister} className="hidden md:block gradient-bg text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Get Started</button>
                            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button onClick={() => setMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <span className="ml-2 text-lg font-bold gradient-text">AttendanceTracker</span>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            <NavLink href="#home" mobile onClick={(e) => handleLinkClick(e, '#home')}>Home</NavLink>
                            <NavLink href="#features" mobile onClick={(e) => handleLinkClick(e, '#features')}>Features</NavLink>
                            <NavLink href="#dashboard" mobile onClick={(e) => handleLinkClick(e, '#dashboard')}>Dashboard</NavLink>
                            <NavLink href="#pricing" mobile onClick={(e) => handleLinkClick(e, '#pricing')}>Pricing</NavLink>
                            <NavLink href="#contact" mobile onClick={(e) => handleLinkClick(e, '#contact')}>Contact</NavLink>
                        </nav>
                         <div className="mt-6 px-2 space-y-2">
                             <button onClick={() => { onSignIn(); setMobileMenuOpen(false); }} className="w-full text-left text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-base font-medium rounded-md">Sign In</button>
                             <button onClick={() => { onRegister(); setMobileMenuOpen(false); }} className="w-full text-left gradient-bg text-white px-4 py-2 rounded-lg text-base font-medium hover:opacity-90 transition-opacity">Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const Hero = ({ onRegister, onLinkClick }) => (
    <section id="home" className="pt-16 min-h-screen flex items-center gradient-bg relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white bg-opacity-10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-float-delay"></div>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white bg-opacity-10 rounded-full blur-2xl animate-float"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Smart Attendance <span className="block text-yellow-300">Management</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                    Transform your attendance tracking with AI-powered insights, real-time analytics, and seamless integration for modern educational institutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => onLinkClick('#dashboard')} className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl">
                        <PlayCircle className="w-5 h-5 inline mr-2" /> View Live Demo
                    </button>
                    <button onClick={onRegister} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                        Start Free Trial
                    </button>
                </div>
            </div>
        </div>
    </section>
);

const Features = () => (
    <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to manage attendance efficiently and effectively.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard icon={<Clock className="w-6 h-6 text-white" />} title="Real-time Tracking" description="Monitor attendance in real-time with instant notifications and automated reports." />
                <FeatureCard icon={<BarChart className="w-6 h-6 text-white" />} title="Advanced Analytics" description="Get detailed insights with comprehensive analytics and customizable reports." />
                <FeatureCard icon={<Smartphone className="w-6 h-6 text-white" />} title="Mobile First" description="Access from anywhere with our responsive web app and mobile applications." />
                <FeatureCard icon={<Shield className="w-6 h-6 text-white" />} title="Secure & Private" description="Enterprise-grade security with encrypted data and privacy compliance." />
                <FeatureCard icon={<Users className="w-6 h-6 text-white" />} title="Team Management" description="Manage multiple classes, teachers, and students with role-based permissions." />
                <FeatureCard icon={<Settings className="w-6 h-6 text-white" />} title="Easy Integration" description="Seamlessly integrate with existing systems via API and export capabilities." />
            </div>
        </div>
    </section>
);

const DashboardPreview = () => (
    <section id="dashboard" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Intuitive Dashboard</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get a complete overview of your attendance data with our beautifully designed dashboard.</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 shadow-2xl">
                {/* ... (rest of the dashboard preview HTML, converted to JSX) ... */}
                <h3 className="text-2xl font-bold text-white text-center">Dashboard Preview Coming Soon!</h3>
                <p className="text-gray-400 text-center mt-4">This is where the interactive dashboard will be displayed once a user logs in.</p>
            </div>
        </div>
    </section>
);

const Pricing = ({ onRegister }) => (
    <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Flexible pricing options for schools and institutions of all sizes.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <PricingCard 
                    plan="Basic" 
                    price="$29" 
                    description="Perfect for small schools" 
                    features={['Up to 100 students', 'Basic reporting', 'Email support', 'Mobile access']}
                    onSelect={onRegister}
                />
                <PricingCard 
                    plan="Pro" 
                    price="$79" 
                    description="For growing institutions" 
                    features={['Up to 500 students', 'Advanced analytics', 'Priority support', 'API access', 'Custom integrations']}
                    popular={true}
                    onSelect={onRegister}
                />
                <PricingCard 
                    plan="Enterprise" 
                    price="Custom" 
                    description="For large organizations" 
                    features={['Unlimited students', 'Custom features', '24/7 support', 'On-premise option', 'Dedicated manager']}
                    onSelect={onRegister}
                />
            </div>
        </div>
    </section>
);

const Contact = () => (
    <section id="contact" className="py-20 bg-white">
        {/* ... (Contact section HTML converted to JSX) ... */}
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Ready to transform your attendance management? Let's talk!</p>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-900 text-white py-16">
        {/* ... (Footer HTML converted to JSX) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© 2025 AttendanceTracker Pro. All rights reserved.</p>
        </div>
    </footer>
);


// --- Modal Components ---

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-8">
                <button onClick={onClose} className="absolute top-0 right-0 pt-4 pr-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>
                {/* Form elements will go here */}
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?
                    <button onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:text-blue-500 ml-1">Sign Up</button>
                </p>
            </div>
        </div>
    );
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-8">
                <button onClick={onClose} className="absolute top-0 right-0 pt-4 pr-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
                    <p className="text-gray-600">Start your free trial today</p>
                </div>
                {/* Form elements will go here */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?
                    <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 ml-1">Sign In</button>
                </p>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    const handleOpenLogin = () => {
        setRegisterModalOpen(false);
        setLoginModalOpen(true);
    };

    const handleOpenRegister = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(true);
    };

    const handleCloseModals = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(false);
    };

    const handleSmoothScroll = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    useEffect(() => {
        // Prevent body scroll when a modal is open
        if (isLoginModalOpen || isRegisterModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isLoginModalOpen, isRegisterModalOpen]);

    return (
        <>
            <CustomStyles />
            <div className="bg-gray-50">
                <Navbar onSignIn={handleOpenLogin} onRegister={handleOpenRegister} onLinkClick={handleSmoothScroll} />
                <main>
                    <Hero onRegister={handleOpenRegister} onLinkClick={handleSmoothScroll} />
                    <Features />
                    <DashboardPreview />
                    <Pricing onRegister={handleOpenRegister} />
                    <Contact />
                </main>
                <Footer />

                <LoginModal 
                    isOpen={isLoginModalOpen} 
                    onClose={handleCloseModals} 
                    onSwitchToRegister={handleOpenRegister} 
                />
                <RegisterModal 
                    isOpen={isRegisterModalOpen} 
                    onClose={handleCloseModals} 
                    onSwitchToLogin={handleOpenLogin}
                />
            </div>
        </>
    );
}
