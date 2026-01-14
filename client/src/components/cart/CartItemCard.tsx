import { Trash2 } from "lucide-react";

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
export default CartItemCard