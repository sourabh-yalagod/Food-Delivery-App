import React, { useEffect, useState, useCallback } from 'react';
import { useGetMenusQuery } from '../redux/endPoints/menu';
import { useAddToCartMutation } from '../redux/endPoints/cart';
import FoodItemCard from '../components/FoodItemCard';
import useAuth from '../hooks/useAuth';
import LoadingSkeleton from '../components/home/LoadingSkeleton';
import ErrorState from '../components/home/ErrorState';
import EmptyState from '../components/home/EmptyState';
import HeroSection from '../components/home/HeroSection';

interface MenuItem {
    id: string;
    [key: string]: any;
}


const Home: React.FC = () => {
    const { data, isLoading, error } = useGetMenusQuery();
    const [addToCartApi] = useAddToCartMutation();
    const { isAuthenticated, cartId } = useAuth();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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
        },
        [isAuthenticated, cartId, addToCartApi]
    );

    const handleRemoveFromCart = useCallback((cartItemId: string): void => {
        console.log('Removed from cart:', cartItemId);
    }, [, menuItems]);

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
                            item={item}
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

export default Home;