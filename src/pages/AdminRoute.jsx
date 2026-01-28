import { Navigate } from "react-router-dom";    
import { useAuth } from "../context/useAuth";

export default function AdminRoute({ children }) {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated || user.role_id !== 1) {
        return <Navigate to="/" replace />;
    }
    return children;
}