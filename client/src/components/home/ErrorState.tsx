import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
    message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-xl font-bold text-gray-800">Error Loading Menu</h2>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
                Retry
            </button>
        </div>
    </div>
);
export default ErrorState;