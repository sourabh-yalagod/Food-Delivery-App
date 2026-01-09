import React, { useState, useCallback, useEffect } from 'react';
import { Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useGetCartsQuery, useRemoveFromCartMutation } from '../redux/endPoints/cart';
import { Skeleton } from '../components/ui/skeleton';
import { useParams } from 'react-router-dom';


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

// Subcomponents
interface CartItemCardProps {
    item: CartItem;
    isRemoving: boolean;
    itemTotal: number;
    onRemove: (cartItemId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, isRemoving, itemTotal, onRemove }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
        <div className="flex gap-6">
            {/* Image */}
            <div className="flex-shrink-0 w-32 h-32">
                <img
                    src={`/images/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                />
            </div>

            {/* Details */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.veg
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {item.veg ? 'Veg' : 'Non-Veg'}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-semibold text-gray-800">{item.rating}</span>
                        <span className="text-gray-500 text-sm">({item.votes.toLocaleString()} votes)</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Price per item</p>
                        <p className="text-2xl font-bold text-gray-800">₹{item.price}</p>
                        {item.quantity && item.quantity > 1 && (
                            <p className="text-sm text-gray-500 mt-1">
                                Qty: {item.quantity} × ₹{item.price} = ₹{itemTotal.toFixed(2)}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => onRemove(item.cartItemId)}
                        disabled={isRemoving}
                        className="bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 disabled:text-gray-400 p-3 rounded-lg transition"
                        title="Remove from cart"
                    >
                        {isRemoving ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

interface CartSummaryProps {
    items: CartItem[];
    total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ items, total }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-gray-600">
                <span>Items ({items.length})</span>
                <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-semibold">FREE</span>
            </div>
        </div>

        <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
        </div>

        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition">
            Proceed to Checkout
        </button>
    </div>
);

const CartLoadingSkeleton: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-6 w-32" />
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex gap-6">
                                <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface CartErrorStateProps {
    message: string;
    onRetry: () => void;
}

const CartErrorState: React.FC<CartErrorStateProps> = ({ message, onRetry }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-xl font-bold text-gray-800">Error Loading Cart</h2>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={onRetry}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
                Retry
            </button>
        </div>
    </div>
);

const CartEmptyState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
                Start adding items to your cart to see them here!
            </p>
            <a
                href="/"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
                Continue Shopping
            </a>
        </div>
    </div>
);

function getErrorMessage(error: any): string {
    if (typeof error === 'object' && 'data' in error) {
        return error.data?.message || 'Failed to load cart. Please try again.';
    }
    return 'Failed to load cart. Please try again.';
}

export default Cart;