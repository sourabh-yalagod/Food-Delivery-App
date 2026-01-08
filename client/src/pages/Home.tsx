import React, { useEffect, useState } from 'react';
import { useGetMenusQuery } from '../redux/endPoints/menu';
import FoodItemCard from '../components/FoodItemCard';
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle } from 'lucide-react';


const Home: React.FC = () => {
    const { data, isLoading, error } = useGetMenusQuery();
    const [menuItems, setMenuItems] = useState<any[]>([])
    console.log(menuItems);
    useEffect(() => {
        setMenuItems(data);
    }, [data])
    const [cartItems, setCartItems] = useState<Set<string>>(new Set());

    const handleAddToCart = (itemId: string): void => {
        const newCartItems = new Set(cartItems);
        newCartItems.add(itemId);
        setCartItems(newCartItems);
        console.log('Added to cart:', itemId);
    };

    const handleRemoveFromCart = (cartItemId: string): void => {
        const newCartItems = new Set(cartItems);
        // Find and remove item by cartItemId
        menuItems.forEach((item) => {
            if (item.cartItemId === cartItemId) {
                newCartItems.delete(item.id);
            }
        });
        setCartItems(newCartItems);
        // TODO: Make API call to remove item from cart
        console.log('Removed from cart:', cartItemId);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Skeleton */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                                <Skeleton className="h-48 w-full mb-4" />
                                <Skeleton className="h-6 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                        <h2 className="text-xl font-bold text-gray-800">Error Loading Menu</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        {typeof error === 'object' && 'data' in error
                            ? (error.data as any)?.message || 'Failed to load menu items. Please try again.'
                            : 'Failed to load menu items. Please try again.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty State
    if (!menuItems || menuItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Items Available</h2>
                    <p className="text-gray-600">
                        We're currently out of items. Please check back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Swiggy</h1>
                    <p className="text-gray-600 text-lg">
                        Discover delicious food from your favorite restaurants
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Items Count */}
                <div className="mb-8">
                    <p className="text-gray-600 text-lg">
                        Showing <span className="font-semibold text-gray-800">{menuItems.length}</span> items
                    </p>
                </div>

                {/* Food Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <FoodItemCard
                            key={item.id}
                            item={{
                                ...item,
                                cartItemId: cartItems.has(item.id) ? item.id : null,
                            }}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Spacing */}
            <div className="py-12" />
        </div>
    );
};

export default Home;