import React from "react";
import { cn } from "@/lib/utils";

const Dialog = React.forwardRef(({ className, open, onOpenChange, children, ...props }, ref) => (
  open ? (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        className
      )}
      {...props}
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)}></div>
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg z-50">
        {children}
      </div>
    </div>
  ) : null
));

Dialog.displayName = "Dialog";

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
DialogContent.displayName = "DialogContent";

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
DialogFooter.displayName = "DialogFooter";

export { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogContent };