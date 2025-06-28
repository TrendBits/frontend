import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | string[];
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div
          className={`
              relative w-full bg-secondaryBg rounded-lg border-0
              shadow-[0_0_0_1px_#ECE3D2]
              focus-within:shadow-[0_0_0_2px_#FBA788]
              transition-shadow duration-200 ease-in-out
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? "shadow-[0_0_0_2px_#ef4444]" : ""}
              ${className}
            `}
        >
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full py-2 bg-transparent border-0 outline-none
              placeholder:text-gray-400
              font-poppins
              disabled:text-gray-500 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : "pl-4"}
              ${rightIcon ? "pr-10" : "pr-4"}
            `
              .trim()
              .replace(/\s+/g, " ")}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="mt-1">
            {Array.isArray(error) ? (
              <ul className="list-disc list-inside">
                {error.map((err, index) => (
                  <li key={index} className="text-xs text-red-600">
                    <em>{err}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <em className="text-xs text-red-600">{error}</em>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
