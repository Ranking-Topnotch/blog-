// const logout = () => {
//     window.open("http://localhost:8000/auth/logout", "_self");
// };

let loggedOut = false; // Flag to track whether logout has occurred

const logout = () => {
    if (!loggedOut) {
        loggedOut = true; // Set loggedOut flag to true to prevent repeated logout
        window.open("http://localhost:8000/auth/logout", "_self");
    }
};

const userSession = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/usersession`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resData = await response.json()
        console.log(resData.member)
        if (resData.sessionActive) {
            return { sessionActive: resData.sessionActive, member: resData.member };
        }else{
            //logout()
            return resData.sessionActive; 
        }    

    } catch (error) {
        console.error("Error checking refresh token:", error);
    }
};

export default userSession;