
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

export default HeroSection;