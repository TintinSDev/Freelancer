import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have your utility function for class names

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[130px] w-full rounded-md border border-primary-foreground bg-primary-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-primary placeholder:text-gray-600 placeholder:font-semibold transition duration-500 ease-in-out disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };