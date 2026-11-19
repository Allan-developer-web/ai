"use client";

import Link from "next/link";
import { useState } from "react";
import { useRestaurant } from "@/context/RestaurantContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { cartCount, user, logout } = useRestaurant();

  return (
    <header className="green-bg text-white">
      <div className="container-main">
        <div className="h-14 flex items-center justify-between">

          <Link
            href="/"
            className="font-bold text-lg flex items-center gap-2"
          >
            🍴 Foodies
          </Link>

          <nav className="desktop-nav flex items-center gap-7 text-xs">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-5 text-xs">
            <Link href="/menu">⌕</Link>

            <Link href="/cart">
              🛒 Cart ({cartCount})
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">◉</Link>

                <button onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">♙</Link>
            )}
          </div>

          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-4 text-sm">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/menu" onClick={() => setOpen(false)}>
              Menu
            </Link>

            <Link href="/#about" onClick={() => setOpen(false)}>
              About
            </Link>

            <Link href="/#contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <Link href="/cart">
              🛒 Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <Link href="/dashboard">
                  Dashboard
                </Link>

                <button
                  className="text-left"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;