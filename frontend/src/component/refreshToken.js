const logout = () => {
    window.open("http://localhost:8000/auth/logout", "_self");
};

const refreshToken = async () => {
    const accessToken = `; ${document.cookie}`.split(`; accessToken=`).pop().split(';').shift();
    
    if (!accessToken) {
        try {
            const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/refreshtoken`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify()
            });
            
            if (!fetchData.ok) {
                throw new Error("Failed to refresh token");
            }

            const resData = await fetchData.json();
            if(resData.message === false){
                logout()
            }
            console.log(resData);
            return true; 
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    } else {
        return true;
    }
};

export default refreshToken;
