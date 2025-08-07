import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = "", children, ...props }, ref) => {
    const baseClasses = `
      font-medium rounded-xl transition-all duration-200 ease-in-out
      focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantClasses = {
      primary: `
        bg-customprimary text-white
        shadow-[0_0_0_1px_#FBA788]
        hover:bg-[#f09974] hover:shadow-[0_0_0_1px_#f09974]
        focus:shadow-[0_0_0_3px_rgba(251,167,136,0.3)]
      `,
      secondary: `
        bg-secondaryBg text-gray-700
        shadow-[0_0_0_1px_#ECE3D2]
        hover:shadow-[0_0_0_1px_#ECE3D2]
        focus:shadow-[0_0_0_1px_#FBA788]
      `,
      outline: `
        bg-transparent text-customprimary
        shadow-[0_0_0_1px_#FBA788]
        hover:bg-customprimary hover:text-white
        focus:shadow-[0_0_0_1px_rgba(251,167,136,0.3)]
      `
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
