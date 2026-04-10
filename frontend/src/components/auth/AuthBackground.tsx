import type { ReactNode } from 'react';

interface AuthBackgroundProps {
  children: ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.5] brightness-[0.3]"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop)',
        }}
      />
      {children}
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
