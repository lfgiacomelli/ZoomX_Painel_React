import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailHeader() {
  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              <span className="text-blue-600">Zoom</span>
              <span className="text-gray-800">X</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/email" 
              className="text-blue-600 font-medium text-sm"
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}