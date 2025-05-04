import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "medium", fullPage = false, text = "Loading..." }) => {
  const sizeClass = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClass[size]} animate-spin text-primary`} />
      {text && <span className="ml-2">{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="flex items-center justify-center min-h-[70vh]">{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
