let loggedOut = false; // Flag to track whether logout has occurred

const logout = () => {
    if (!loggedOut) {
        loggedOut = true; // Set loggedOut flag to true to prevent repeated logout
        window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/logout`, "_self");
    }
};

const userSession = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/session/usersession`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resData = await response.json()
        console.log(resData)
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