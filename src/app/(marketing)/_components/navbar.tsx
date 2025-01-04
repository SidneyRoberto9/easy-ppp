import Link from 'next/link';

import BrandLogo from '@/components/brand-logo';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

const Navbar = async () => {
  const user = await currentUser();

  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href="#" className="text-lg">
          Features
        </Link>
        <Link href="/#pricing" className="text-lg">
          Pricing
        </Link>
        <Link href="#" className="text-lg">
          About
        </Link>
        <span className="text-lg">
          {user ? (
            <SignedIn>
              <Link href="/dashboard">Dashboard</Link>
            </SignedIn>
          ) : (
            <SignedOut>
              <SignInButton>Login</SignInButton>
            </SignedOut>
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
