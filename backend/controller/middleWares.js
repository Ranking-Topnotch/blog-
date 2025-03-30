const jwt = require('jsonwebtoken')

const generateAccessToken = (checkedMember) => {
    return jwt.sign({email: checkedMember.email, username: checkedMember.username, _id: checkedMember._id, img: checkedMember.img}, process.env.ACCESS_TOKEN_KEY, { expiresIn: "1m"} )
}

const generateRefreshToken = (checkedMember) => {
    return jwt.sign({email: checkedMember.email, username: checkedMember.username, _id: checkedMember._id, img: checkedMember.img}, process.env.REFRESH_TOKEN_KEY, { expiresIn: "120m"} )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,

    refreshToken: ( req, res, next ) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(404).json({ message: false});
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, memberData) => {
            if(err){
                return res.status(403).json({ message: false });
            }
            const newAccessToken = generateAccessToken(memberData);
            return res.cookie('accessToken', newAccessToken,  { expires: new Date(Date.now() + (1 * 60 * 1000)) }).json({ message: true})
        });  
    },

    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, memberData) => {
            if (err) {
            return res.status(403).json("Token is not valid!");
            }
            req.member = memberData;
            next();
        });
        } else {
        return res.status(401).json("You are not authenticated!");
        }
    },

    userSession: ( req, res ) =>  {
        const refreshtoken = req.cookies.refreshToken
        if(!refreshtoken){
            return res.status(200).json({ sessionActive: false });
        }
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_KEY, (err, memberData) => {
            if(err){
                return res.status(403).json({ message: false, sessionActive: false });
            } 
            return res.status(401).json({ sessionActive: true, member: memberData });
        });  
    },

    verifySession: (req, res) => {

        if (!req.cookies || !req.cookies.accessToken) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = req.cookies.accessToken; // Now we safely access it
        try {
            
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            req.agent = decoded; // Attach decoded data to request
            next();
        } catch (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
    }
}