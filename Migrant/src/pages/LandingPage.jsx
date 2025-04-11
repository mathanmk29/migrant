import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50 text-blue-900 font-['Poppins'] overflow-x-hidden">
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16 items-center max-w-[1200px] mx-auto">
            
            {/* Left Section: Text */}
            <div className="space-y-8 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl ml-4 md:ml-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight leading-tight font-['Poppins']">
                Migrant Assistance &<br /> Grievance Redressal System
              </h2>
              <p className="text-lg sm:text-xl text-blue-700 font-medium leading-relaxed">
                A digital platform to support migrants by simplifying grievance reporting and ensuring timely resolution — in collaboration with agencies and government bodies.
              </p>
              <Link to="/signup/migrant" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105 group">
                Get Started
                <span className="ml-2 transition-transform group-hover:translate-x-1 text-xl">→</span>
              </Link>
            </div>

            {/* Right Section: Image */}
            <div className="flex justify-center md:justify-end animate-slideUp md:pr-4 lg:pr-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
                alt="Support illustration"
                className="w-full max-w-lg h-auto object-contain hover:scale-105 transition-transform duration-300 md:translate-x-4"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-200 py-6 text-center text-blue-600 text-sm bg-white/50 backdrop-blur-sm">
        &copy; MAAGRS — Migrant Assistance and Grievance Redressal System
      </footer>
    </div>
  );
};

export default LandingPage;
