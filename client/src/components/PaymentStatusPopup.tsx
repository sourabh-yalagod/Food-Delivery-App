import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentStatusPopup = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("payment-status");

    if (!status) return null;

    const isSuccess = status === "success";

    const handleClose = () => {
        searchParams.delete("payment-status");
        setSearchParams(searchParams);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl text-center animate-scaleIn">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : (
                        <XCircle className="w-16 h-16 text-red-500" />
                    )}
                </div>

                {/* Title */}
                <h2
                    className={`text-xl font-semibold ${isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {isSuccess ? "Payment Successful" : "Payment Failed"}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {isSuccess
                        ? "Your payment has been processed successfully."
                        : "Something went wrong while processing your payment."}
                </p>

                {/* Button */}
                <button
                    onClick={handleClose}
                    className="mt-6 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PaymentStatusPopup;
