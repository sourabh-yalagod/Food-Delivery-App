import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';

interface IFoodItemCard {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    rating: number;
    votes: number;
    cartItemId: string | null;
    veg: boolean;
}

interface IFoodItemCardProps {
    item: IFoodItemCard;
    onAddToCart: (itemId: string, price: number, quantity: number) => void;
    onRemoveFromCart?: (cartItemId: string) => void;
}

const FoodItemCard: React.FC<IFoodItemCardProps> = ({
    item,
    onAddToCart,
    onRemoveFromCart,
}) => {
    const [isAdded, setIsAdded] = useState<boolean>(item.cartItemId !== null);
    const [quantity, setQuantity] = useState(1);
    const handleAddToCart = (): void => {
        onAddToCart(item.id, item.price, quantity);
        setIsAdded(true);
    };

    const handleRemoveFromCart = (): void => {
        console.log(item);
        console.log("Hey")
        if (item.cartItemId && onRemoveFromCart) {
            onRemoveFromCart(item.cartItemId);
            setIsAdded(false);
        }
    };

    return (
        <div
            className="bg-white relative rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            <div className='absolute flex w-fit top-1 right-2'>
                <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
                <p>{quantity}</p>
                <button onClick={() => setQuantity(prev => prev != 1 ? prev - 1 : prev)}>-</button>
            </div>
            {/* Image Container */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />

                {/* Veg/Non-Veg Badge */}
                <div
                    className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center ${item.veg
                        ? 'border-green-600 bg-green-50'
                        : 'border-red-600 bg-red-50'
                        }`}
                >
                    <div
                        className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'
                            }`}
                    ></div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ₹{item.price}
                </div>

                {isAdded && (
                    <div className="absolute inset-0 bg-green-600 bg-opacity-70 flex items-center justify-center">
                        <Button
                            onClick={handleRemoveFromCart}
                            variant="outline"
                            className="bg-white text-green-600 hover:bg-red-50 hover:text-red-600 font-semibold border-white"
                        >
                            Remove
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex-1 p-4 flex flex-col">
                {/* Name */}
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                    {item.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>

                {/* Rating and Votes */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                            {item.rating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">({item.votes.toLocaleString()} votes)</span>
                </div>

                {/* Add to Cart Button - Mobile View */}
                {!isAdded && (
                    <Button
                        onClick={handleAddToCart}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </Button>
                )}

                {isAdded && (
                    <Button
                        onClick={handleRemoveFromCart}
                        variant="outline"
                        className="w-full border-orange-600 text-orange-600 hover:bg-red-50 font-semibold"
                    >
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FoodItemCard;