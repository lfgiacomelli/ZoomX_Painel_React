import { BlinkBlur } from 'react-loading-indicators';

interface LoadingProps {
  text?: string;
}

export const Loading = ({ text }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <BlinkBlur
        color="#2222"
        size="medium"
        textColor="#222"
      />
      {text && (
        <span className="text-[#222] text-lg animate-pulse mt-2">
          {text}
        </span>
      )}
    </div>
  )
}
