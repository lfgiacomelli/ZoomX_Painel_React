import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {User2Icon} from 'lucide-react';

export default function HomeHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`w-full bg-white transition-all duration-300 fixed top-0 left-0 z-50 
      ${isScrolled ? 'shadow-lg py-2' : 'shadow-sm py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-gray-900 select-none flex items-center">
                <span className="text-blue-600">Zoom</span>
                <span className="text-gray-800">X</span>
              </span>
            </a>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <a onClick={() => navigate('/login')}>
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md
                             transition-all duration-300 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             active:scale-95 group"
                >
                  <User2Icon className="w-4 h-4 mr-2" />
                  <span className="relative z-10">Entrar</span>
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </a>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden 
        ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t">
          <div className="pt-4 border-t border-gray-200">
            <a
              onClick={() => navigate('/login')}
              className="block w-full px-4 py-2 text-center rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium border"
            >
              Entrar
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}