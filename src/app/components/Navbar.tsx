// src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState, useEffect } from 'react';
import { CartItem } from '../types';

const Navbar: React.FC = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // This function updates the cart count from localStorage.
    // It's designed to run on the client side only.
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const cart: CartItem[] = JSON.parse(storedCart);
          const count = cart.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(count);
        } catch (error) {
          console.error('Failed to parse cart from localStorage', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    // Initial update
    updateCartCount();

    // Listen for custom event to update cart count
    window.addEventListener('cartUpdated', updateCartCount);

    // Clean up the event listener
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
<nav className="fixed w-full top-0 z-20 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Link href="/" className="text-2xl font-extrabold text-white hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
      Amana Bookstore
    </Link>
    <div className="flex items-center space-x-6">
      <Link
        href="/"
        className={`text-white hover:text-yellow-300 transition-colors duration-300 cursor-pointer ${
          pathname === '/' ? 'font-semibold underline decoration-yellow-300 underline-offset-4' : ''
        }`}
      >
        Home
      </Link>
      <Link
        href="/cart"
        className={`text-white hover:text-yellow-300 flex items-center transition-colors duration-300 cursor-pointer ${
          pathname === '/cart' ? 'font-semibold underline decoration-yellow-300 underline-offset-4' : ''
        }`}
      >
        My Cart
        {cartItemCount > 0 && (
          <span className="ml-2 bg-yellow-300 text-blue-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </Link>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
