import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="w-full flex justify-between items-center px-6 sm:px-8 lg:px-12 py-4">
        
        {/* ✅ Wrap title in a Link */}
        <Link to="/">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent tracking-tight leading-snug font-['Poppins'] cursor-pointer">
            MAAGRS
          </h1>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Sign In Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSignInOpen(!isSignInOpen);
                setSignUpOpen(false);
              }}
              className="text-blue-800 hover:text-blue-600 transition duration-200 flex items-center gap-2 font-medium text-lg px-5 py-2"
            >
              Sign In
              <svg className={`w-5 h-5 transition-transform ${isSignInOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSignInOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 py-2 z-50">
                {[
                  ['migrant', 'Migrant Login'],
                  ['agency', 'Agency Login'],
                ].map(([path, label]) => (
                  <Link key={path} to={`/signin/${path}`} className="block px-4 py-2.5 hover:bg-blue-50 text-blue-800 transition-all text-lg font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sign Up Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSignUpOpen(!isSignUpOpen);
                setSignInOpen(false);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2 rounded-full text-white text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2"
            >
              Sign Up
              <svg className={`w-5 h-5 transition-transform ${isSignUpOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSignUpOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 py-2 z-50">
                {[
                  ['migrant', 'Migrant Registration'],
                  ['agency', 'Agency Registration'],
                ].map(([path, label]) => (
                  <Link key={path} to={`/signup/${path}`} className="block px-4 py-2.5 hover:bg-blue-50 text-blue-800 transition-all text-lg font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
