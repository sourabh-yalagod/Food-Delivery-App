const EmptyState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Items Available</h2>
            <p className="text-gray-600">We're currently out of items. Please check back later!</p>
        </div>
    </div>
);

export default EmptyState;