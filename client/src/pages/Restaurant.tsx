import React, { useEffect, useState } from 'react';
import { useGetRestaurantsQuery } from '../redux/endPoints/restaurant';
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

const Restaurant: React.FC = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetRestaurantsQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([])
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);


    // Filter restaurants based on search and rating
    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRating = ratingFilter ? restaurant.rating >= ratingFilter : true;
        return matchesSearch && matchesRating;
    });
    useEffect(() => {
        setRestaurants(data);
    }, [data])
    const handleNavigateToRestaurant = (restaurantId: string): void => {
        navigate(`/restaurant/${restaurantId}`);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Skeleton */}
                <div className="bg-white shadow-sm sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-10 w-full" />
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
                                <Skeleton className="h-4 w-2/3 mb-4" />
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
                        <h2 className="text-xl font-bold text-gray-800">Error Loading Restaurants</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        {typeof error === 'object' && 'data' in error
                            ? (error.data as any)?.message || 'Failed to load restaurants. Please try again.'
                            : 'Failed to load restaurants. Please try again.'}
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
    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Restaurants Available</h2>
                    <p className="text-gray-600">
                        We couldn't find any restaurants. Please check back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurants Near You</h1>
                        <p className="text-gray-600">
                            Discover amazing food from {restaurants.length} restaurants
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Bar */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search restaurants or cuisines..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            />
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <select
                                value={ratingFilter?.toString() || ''}
                                onChange={(e) => setRatingFilter(e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            >
                                <option value="">All Ratings</option>
                                <option value="4.5">4.5+ ⭐</option>
                                <option value="4">4+ ⭐</option>
                                <option value="3.5">3.5+ ⭐</option>
                                <option value="3">3+ ⭐</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Results Count */}
                <div className="mb-8">
                    <p className="text-gray-600 text-lg">
                        Found <span className="font-semibold text-gray-800">{filteredRestaurants.length}</span> restaurants
                    </p>
                </div>

                {/* No Results State */}
                {filteredRestaurants.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                ) : (
                    /* Restaurants Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                onNavigate={handleNavigateToRestaurant}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Spacing */}
            <div className="py-12" />
        </div>
    );
};

export default Restaurant;