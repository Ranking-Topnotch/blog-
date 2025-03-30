import { createContext, useState, useEffect, useContext } from "react";
import { UseIsAuthenticated } from "./UseIsAuthenticated";
import toast from "react-hot-toast";


// Create the context
export const UserContext = createContext(false);

export const UserProvider = ({ children }) => {
    const [ member, setMember ] = useState(null);
    const { setIsAuthenticated } = useContext(UseIsAuthenticated)

    // Check if user is logged in on app load
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch("http://localhost:8000/session/auth/check", {
    //                 credentials: "include", // Important for sending cookies
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setMember(data.member); // Set user from backend
    //                 console.log(member)
    //             } else {
    //                 setMember(null); // Clear user if not authenticated
    //             }
    //         } catch (error) {
    //             setMember(null);
    //         }
    //     };

    //     checkAuth();
    // }, []);

    // Function to log in a user
    const login = async (email, password) => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Important for sending cookies
        });

        const data = await response.json();
        
        if (!response.ok) {
            toast(data.message)
        }

        setMember(data.member); // Store only necessary user data (NOT token)
        return data
    };

    // Function to log out the user
    const logout = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/logout`, {
            method: "GET",
            credentials: "include", // Ensure cookie is cleared
        });

        const res = await response.json()
        if(res.message === 'User successfully logged out'){
            setMember(null);
            setIsAuthenticated(null)
            toast(res.message)
        }
    };

    return (
        <UserContext.Provider value={{ member, setMember, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
