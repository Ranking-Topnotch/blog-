import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UseIsAuthenticated } from "../context/UseIsAuthenticated";
import { UserContext } from "../context/UserContext";
import userSession from "./userSession";

const ProtectedRoute = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(UseIsAuthenticated);
    const { member, setMember } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { sessionActive, member } = await userSession();
        console.log("checking", sessionActive, member)
                if (sessionActive) {
                    setIsAuthenticated(true);
                    setMember(member);
                    console.log(member, isAuthenticated)
                } else {
                    setIsAuthenticated(false);
                    setMember(null);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
                setMember(null);
                
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth(); 

        const interval = setInterval(checkAuth, 3600000);

        return () => clearInterval(interval); 
    }, []);

    if (isLoading) return <p>Loading...</p>; 

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
