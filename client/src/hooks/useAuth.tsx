import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = localStorage.getItem("accessToken");
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [payload, setPayload] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const decoded: any = jwtDecode(token);
            console.log(decoded)
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("accessToken");
                setIsAuthenticated(false);
                setPayload(null);
            } else {
                setIsAuthenticated(true);
                setPayload(decoded);
            }
        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem("accessToken");
            setIsAuthenticated(false);
            setPayload(null);
        }

        setLoading(false);
    }, []);
    return { isAuthenticated, userId: payload?.userId, loading, cartId: payload?.cartId };
};

export default useAuth;
