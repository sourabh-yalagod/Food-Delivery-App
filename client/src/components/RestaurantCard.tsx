import { MapPin, Clock, Star, ChevronRight } from 'lucide-react';

const RestaurantCard: React.FC<{ restaurant: IRestaurant; onNavigate: (id: string) => void }> = ({
    restaurant,
    onNavigate,
}) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => onNavigate(restaurant.id)}
        >
            {/* Image Container */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1 font-semibold text-sm">
                    <Star className="w-4 h-4 fill-white" />
                    {restaurant.rating}
                </div>

                {/* Cost Badge */}
                <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {restaurant.cost}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4">
                {/* Restaurant Name */}
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-orange-600 transition">
                    {restaurant.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="line-clamp-1">{restaurant.location}</span>
                </div>

                {/* Distance and Duration */}
                <div className="flex items-center gap-4 mb-4">
                    {restaurant.distance && (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{restaurant.distance} km</span>
                        </div>
                    )}
                    {restaurant.duration && (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.duration} min</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {restaurant.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{restaurant.description}</p>
                )}

                {/* View More Button */}
                <button className="w-full flex items-center justify-between bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                    <span>View Menu</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default RestaurantCard;