interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`w-full max-w-md bg-white p-4 shadow-lg rounded-lg ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={`flex flex-col items-center mb-4 ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h2 className={`text-2xl font-semibold ${className || ""}`}>{children}</h2>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`p-4 ${className || ""}`}>{children}</div>;
}

export function Lock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="40"
      height="40"
    >
      <path
        fillRule="evenodd"
        d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v3H9V7zm6 9a3 3 0 11-6 0 3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
