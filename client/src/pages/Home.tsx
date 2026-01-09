import React, { useEffect, useState, useCallback } from 'react';
import { useGetMenusQuery } from '../redux/endPoints/menu';
import { useAddToCartMutation } from '../redux/endPoints/cart';
import FoodItemCard from '../components/FoodItemCard';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

interface MenuItem {
    id: string;
    [key: string]: any;
}


const Home: React.FC = () => {
    const { data, isLoading, error } = useGetMenusQuery();
    const [addToCartApi] = useAddToCartMutation();
    const { isAuthenticated, cartId } = useAuth();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cartItems, setCartItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (data) {
            setMenuItems(data);
        }
    }, [data]);

    const handleAddToCart = useCallback(
        async (itemId: string, price: number, quantity: number): Promise<void> => {
            if (!isAuthenticated) return;

            await addToCartApi({
                price,
                quantity,
                menuId: itemId,
                cartId,
            } as any).unwrap() as any;

            setCartItems(prev => new Set(prev).add(itemId));
        },
        [isAuthenticated, cartId, addToCartApi]
    );

    const handleRemoveFromCart = useCallback((cartItemId: string): void => {
        const newCartItems = new Set(cartItems);
        menuItems.forEach((item) => {
            if (item.cartItemId === cartItemId) {
                newCartItems.delete(item.id);
            }
        });
        setCartItems(newCartItems);
        console.log('Removed from cart:', cartItemId);
    }, [cartItems, menuItems]);

    const getErrorMessage = (): string => {
        if (typeof error === 'object' && 'data' in error) {
            return (error.data as any)?.message || 'Failed to load menu items. Please try again.';
        }
        return 'Failed to load menu items. Please try again.';
    };

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={getErrorMessage()} />;
    if (!menuItems.length) return <EmptyState />;

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection itemCount={menuItems.length} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map((item: any) => (
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

            <div className="py-12" />
        </div>
    );
};

// Subcomponents
const LoadingSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-6 w-96" />
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden">
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

interface ErrorStateProps {
    message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-xl font-bold text-gray-800">Error Loading Menu</h2>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
                Retry
            </button>
        </div>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Items Available</h2>
            <p className="text-gray-600">We're currently out of items. Please check back later!</p>
        </div>
    </div>
);

interface HeroSectionProps {
    itemCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ itemCount }) => (
    <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Swiggy</h1>
            <p className="text-gray-600 text-lg">
                Discover delicious food from your favorite restaurants
            </p>
            <p className="text-gray-600 text-lg mt-4">
                Showing <span className="font-semibold text-gray-800">{itemCount}</span> items
            </p>
        </div>
    </div>
);

export default Home;