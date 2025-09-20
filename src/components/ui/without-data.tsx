import Lottie from 'lottie-react';
import noDataAnimation from '@/assets/animations/no_data.json';

type WithoutDataProps = {
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export default function WithoutData({ message, buttonLabel, onButtonClick }: WithoutDataProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-gray-800 dark:text-gray-100">
      <div className="w-full max-w-md flex justify-center mb-6">
        <Lottie 
          animationData={noDataAnimation} 
          loop 
          style={{ width: '100%', maxWidth: 400, height: 'auto' }} 
        />
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-2 animate-fade-in">
        {message}
      </h1>

      {buttonLabel && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 mt-4"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
