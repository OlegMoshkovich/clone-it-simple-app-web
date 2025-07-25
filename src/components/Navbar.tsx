"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { FileText, Plus, BarChart3, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Logs', href: '/logs', icon: FileText },
    { name: 'Create', href: '/create', icon: Plus },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">clone:it</span>
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 