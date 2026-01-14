import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useGetCartsQuery, useRemoveFromCartMutation } from '../redux/endPoints/cart';
import { useParams } from 'react-router-dom';
import CartSummary from '../components/cart/CartSummary';
import CartItemCard from '../components/cart/CartItemCard';
import CartLoadingSkeleton from '../components/cart/CartLoadingSkeleton';
import CartErrorState from '../components/cart/CartErrorState';
import CartEmptyState from '../components/cart/CartEmptyState';


const Cart: React.FC = () => {
    const { cartId }: any = useParams();
    const { data: cartData, isLoading, error, refetch } = useGetCartsQuery(cartId);
    const [removeFromCartApi] = useRemoveFromCartMutation();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [removeError, setRemoveError] = useState<string | null>(null);
    const [items, setItems] = useState([])
    useEffect(() => {
        setItems(cartData);
    }, cartData)
    const handleRemoveFromCart = useCallback(
        async (cartItemId: string): Promise<void> => {
            setRemovingId(cartItemId);
            setRemoveError(null);
            console.log("cartItemId : ", cartItemId)
            try {
                await removeFromCartApi(cartItemId as any).unwrap();
                refetch();
            } catch (err) {
                console.error('Failed to remove item from cart:', err);
                setRemoveError('Failed to remove item. Please try again.');
            } finally {
                setRemovingId(null);
            }
        },
        [cartId, removeFromCartApi, refetch]
    );

    const calculateTotal = (): number => {
        return items.reduce((total, item: any) => {
            const price = parseFloat(item?.price) || 0;
            const quantity = item?.quantity || 1;
            return total + price * quantity;
        }, 0);
    };

    const calculateItemTotal = (item: CartItem): number => {
        const price = parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        return price * quantity;
    };

    // Loading State
    if (isLoading) {
        return <CartLoadingSkeleton />;
    }

    // Error State
    if (error) {
        return <CartErrorState message={getErrorMessage(error)} onRetry={refetch} />;
    }

    // Empty State
    if (!items || items.length === 0) {
        return <CartEmptyState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-orange-600" />
                        <h1 className="text-4xl font-bold text-gray-800">Your Cart</h1>
                    </div>
                    <p className="text-gray-600 text-lg mt-2">
                        <span className="font-semibold text-gray-800">{items.length}</span> {items.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {removeError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-800">Error</h3>
                                    <p className="text-red-700 text-sm">{removeError}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {items.map((item: any) => (
                                <CartItemCard
                                    key={item.cartItemId}
                                    item={item}
                                    isRemoving={removingId === item.cartItemId}
                                    onRemove={handleRemoveFromCart}
                                    itemTotal={calculateItemTotal(item)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary items={items} total={calculateTotal()} />
                    </div>
                </div>
            </div>

            {/* Footer Spacing */}
            <div className="py-12" />
        </div>
    );
};

function getErrorMessage(error: any): string {
    if (typeof error === 'object' && 'data' in error) {
        return error.data?.message || 'Failed to load cart. Please try again.';
    }
    return 'Failed to load cart. Please try again.';
}

export default Cart;