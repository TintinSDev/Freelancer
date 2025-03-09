import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have your utility function for class names

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-4 w-2 rounded-md border border-primary-foreground bg-primary-foreground px-1 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed opacity-50 focus:border-primary placeholder:text-gray-600 placeholder:font-semibold transition duration-500 ease-in-out",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };