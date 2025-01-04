import { PropsWithChildren } from 'react';

export default async function AuthLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen flex flex-col justify-center items-center">{children}</div>;
}
