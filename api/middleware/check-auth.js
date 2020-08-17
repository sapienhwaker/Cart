const jwt = require('jsonwebtoken');
const role = require('./role');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        //let parsed = JSON.parse(decoded);
        //console.log(parsed);
        if(role[decoded.role].find(function(url){ return url==req.baseUrl}))
        {
            req.user=decoded;
            next();
}
else
return res.status(401).json({message: 'Access Denied: You dont have correct privilege to perform this operation'});
        console.log(decoded.role);
    } catch (error) {
      console.log(error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
