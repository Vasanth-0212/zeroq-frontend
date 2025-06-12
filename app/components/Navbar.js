'use client';
import Link from 'next/link';
import Login from './Login';
import { useState } from 'react';
import { Menu, X, CircleUserRound } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const [role, setRole] = useState("");
    const [userId, setUserId] = useState("");

    const router = useRouter();

    const handleClick = () => {
        if (role === "business-partner") {
            router.push("/saloon?id=" + userId);
        } else {
            router.push("/bookings?customer=" + userId);
        }
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
        setRole(storedRole);
    }, []);

    const handleScroll = (e) => {
        e.preventDefault();
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="bg-white h-20 shadow-xl w-screen border border-b-2 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-4 flex items-center justify-between h-16">
                <Link href="/" className="text-4xl font-bold text-gray-800 font-nova-round">ZeroQ</Link>

                <div className="hidden md:flex space-x-8 items-center">
                    <Link href="/" className="text-gray-700 text-xl hover:text-gray-900">Home</Link>
                    <Link href="/all-saloons" className="text-gray-700 text-xl hover:text-gray-900">Salons</Link>
                    <Link href="#contact" onClick={handleScroll} className="text-gray-700 text-xl hover:text-gray-900">Contact Us</Link>
                    {!userId && (
                        <h1
                            className="text-gray-700 text-xl hover:text-gray-900 cursor-pointer"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Login
                        </h1>
                    )}
                    {role && userId && (
                        <DropdownMenu>
                            <DropdownMenuTrigger><CircleUserRound className="h-7 w-7 text-slate-700 cursor-pointer" strokeWidth={1} /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleClick}
                                ><span className="flex-grow">{role === "customer" ? "Your Bookings" : "View Bookings"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        localStorage.removeItem("role");
                                        localStorage.removeItem("userId");
                                        setRole("");
                                        setUserId("");
                                        router.push("/");
                                    }}
                                >
                                    <span className="flex-grow">Logout</span>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="flex items-center mr-3 space-x-5 md:hidden">
                    {role && userId && (
                        <DropdownMenu>
                            <DropdownMenuTrigger><CircleUserRound className="h-7 w-7 text-slate-700 cursor-pointer" strokeWidth={1} /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleClick}
                                ><span className="flex-grow">{role === "customer" ? "Your Bookings" : "View Bookings"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        localStorage.removeItem("role");
                                        localStorage.removeItem("userId");
                                        setRole("");
                                        setUserId("");
                                        router.push("/");
                                    }}
                                >
                                    <span className="flex-grow">Logout</span>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Menu
                        className="text-gray-700 text-3xl cursor-pointer"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                </div>

            </div>

            {showMenu && (
                <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 text-xl font-medium md:hidden transition-all">
                    <button
                        className="absolute top-4 right-6 text-3xl text-gray-700"
                        onClick={() => setShowMenu(false)}
                    >
                        <X className="text-gray-700" />
                    </button>
                    <Link href="/" onClick={() => setShowMenu(false)} className="hover:text-gray-900">Home</Link>
                    <Link href="/about" onClick={() => setShowMenu(false)} className="hover:text-gray-900">Saloons</Link>
                    <Link href="/contact" onClick={() => setShowMenu(false)} className="hover:text-gray-900">Contact Us</Link>
                    {!userId && (
                        <h1
                            className="hover:text-gray-900 cursor-pointer"
                            onClick={() => {
                                setIsLoginOpen(true);
                                setShowMenu(false);
                            }}
                        >
                            Login
                        </h1>
                    )}
                </div>
            )}

            {/** Login Modal */}
            <div
                className={` ${isLoginOpen ? 'scale-100' : 'scale-0'} fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center`}
            >
                <Login setIsLoginOpen={setIsLoginOpen} />
            </div>
        </nav>

    );
}

export default Navbar;