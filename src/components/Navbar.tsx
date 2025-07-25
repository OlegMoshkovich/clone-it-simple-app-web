"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from './ui/navigation-menu';
import { FileText, Plus, Settings, User, BarChart3, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/logs" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <span className="text-xl font-bold text-gray-900">Clone it</span>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/logs"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/logs') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                    >
                      <FileText className="w-4 h-4 mr-2 inline" />
                      Logs
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/create"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/create') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Create
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/reports"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/reports') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2 inline" />
                      Reports
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="rounded-full">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link 
                href="/logs" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/logs') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Logs
              </Link>
              
              <Link 
                href="/create" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/create') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create
              </Link>
              
              <Link 
                href="/reports" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/reports') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Reports
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 