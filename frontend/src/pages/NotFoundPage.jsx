import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-7xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <Button asChild>
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Homepage
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
