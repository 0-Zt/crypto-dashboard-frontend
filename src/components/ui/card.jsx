import React from 'react';

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-[#28365a]/70 bg-[linear-gradient(155deg,rgba(16,24,45,0.95)_0%,rgba(10,14,25,0.92)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h3 ref={ref} className={`text-base font-semibold text-[#f4f7ff] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p ref={ref} className={`text-sm text-[#a7b2d2] ${className}`} {...props}>
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={`p-5 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={`flex items-center p-5 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
