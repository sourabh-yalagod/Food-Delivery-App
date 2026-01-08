import React, { useState } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import AppData from '../lib/AppData';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { navLinks, userMenuOptions } = AppData();
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");

    const handleNavigation = (href: string): void => {
        navigate(href);
        setIsOpen(false);
    };

    const handleLogout = (): void => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        navigate('/signin');
    };

    const renderNavLinks = (): React.ReactNode => {
        return navLinks.map((link) => (
            <Button
                key={link.href}
                variant="ghost"
                className="justify-start gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                onClick={() => handleNavigation(link.href)}
            >
                {link.icon}
                <span>{link.label}</span>
            </Button>
        ));
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleNavigation('/')}
                    >
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="hidden sm:inline text-xl font-bold text-gray-800">Swiggy</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                className="gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => handleNavigation(link.href)}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2">
                        {/* Desktop User Menu */}
                        {isAuthenticated && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2 hidden md:flex">
                                        <User className="w-5 h-5" />
                                        <span className="hidden lg:inline text-gray-700">{userName}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-semibold text-gray-800">{userName}</p>
                                        <p className="text-xs text-gray-500">Logged in</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    {userMenuOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.href}
                                            onClick={() => handleNavigation(option.href)}
                                            className="gap-2 cursor-pointer"
                                        >
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-red-600">
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Auth Buttons for Non-Authenticated Users */}
                        {!isAuthenticated && (
                            <div className="hidden md:flex gap-2">
                                <Button
                                    variant="ghost"
                                    className="text-gray-700 hover:text-orange-600"
                                    onClick={() => handleNavigation('/signin')}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={() => handleNavigation('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Trigger */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <SheetHeader>
                                    <SheetTitle className="text-left">Menu</SheetTitle>
                                </SheetHeader>

                                {/* Mobile Navigation Links */}
                                <div className="space-y-2 mt-6">
                                    {navLinks.map((link) => (
                                        <Button
                                            key={link.href}
                                            variant="ghost"
                                            className="w-full justify-start gap-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                            onClick={() => handleNavigation(link.href)}
                                        >
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Button>
                                    ))}
                                </div>

                                <div className="my-4 border-t pt-4">
                                    {isAuthenticated ? (
                                        <>
                                            {/* Mobile User Menu */}
                                            <div className="px-2 py-2 mb-4 bg-orange-50 rounded-lg">
                                                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                                            </div>

                                            <div className="space-y-2">
                                                {userMenuOptions.map((option) => (
                                                    <Button
                                                        key={option.href}
                                                        variant="ghost"
                                                        className="w-full justify-start gap-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                                        onClick={() => handleNavigation(option.href)}
                                                    >
                                                        {option.icon}
                                                        <span>{option.label}</span>
                                                    </Button>
                                                ))}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                                                onClick={() => handleNavigation('/signin')}
                                            >
                                                Sign In
                                            </Button>
                                            <Button
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                onClick={() => handleNavigation('/signup')}
                                            >
                                                Sign Up
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;