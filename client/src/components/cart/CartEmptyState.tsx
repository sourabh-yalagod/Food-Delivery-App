import { ShoppingCart } from "lucide-react";

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
export default CartEmptyState