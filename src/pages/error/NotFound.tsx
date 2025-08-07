import { Link } from "@tanstack/react-router";
import { Home, ArrowLeft } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { CustomButton } from "../../components/ui";

const NotFound = () => {
  return (
    <RootLayout className="justify-center items-center flex">
      <div className="text-center max-w-md mx-auto px-6">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-customprimary mb-4">404</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action CustomButtons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CustomButton onClick={() => window.history.back()} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Go Back
          </CustomButton>
          <Link to="/">
            <CustomButton className="flex items-center gap-2 w-full sm:w-auto">
              <Home size={18} />
              Go Home
            </CustomButton>
          </Link>
        </div>
      </div>
    </RootLayout>
  );
};

export default NotFound;
