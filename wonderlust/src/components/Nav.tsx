"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "AllDestinations", href: "/all-destinations" },
  { label: "Destinations", href: "/add-destination" },
  { label: "My Bookings", href: "/my-bookings" },
];

const authLinks = [
  // { label: "Profile", href: "#", icon: true },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession()
  const user = session?.user;

  const handleSignOut = async () => {
    authClient.signOut();
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="relative flex h-16 items-center justify-between px-5 md:h-[72px] md:px-8">
        {/* Left: primary links (desktop) / hamburger (mobile) */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-brand",
                link.active
                  ? "text-brand underline underline-offset-4 decoration-2"
                  : "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Center: logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Wanderlast home"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        {/* Right: auth links (desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[15px] font-medium text-foreground transition-colors hover:text-brand"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <Popover>
                <PopoverTrigger
                  render={
                    <Avatar>
                      <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  }
                />
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>{user?.name}</PopoverTitle>
                    <PopoverDescription>{user?.email}</PopoverDescription>
                    <Button variant="destructive" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            authLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-[15px] font-medium text-foreground transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 md:hidden">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-[15px] font-medium transition-colors hover:text-brand",
                  link.active
                    ? "text-brand underline underline-offset-4 decoration-2"
                    : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Authentication Links */}
          <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-[15px] font-medium text-foreground hover:text-brand"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user?.image as string}
                    />
                    <AvatarFallback>
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-medium text-foreground transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
}