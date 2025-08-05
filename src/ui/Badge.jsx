export function Badge({ 
    className = "", 
    variant = "default", 
    children, 
    ...props 
  }) {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    
    const variants = {
      default: "bg-blue-100 text-blue-800",
      secondary: "bg-gray-100 text-gray-800",
      destructive: "bg-red-100 text-red-800",
      outline: "border border-gray-200 text-gray-600"
    };
    
    return (
      <span
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }