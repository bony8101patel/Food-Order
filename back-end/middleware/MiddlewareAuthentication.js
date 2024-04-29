// const jwt = require("jsonwebtoken");
// const midToken = "blogging";

// module.exports = (req, res, next) => {
//   try {
//     console.log("Middleware");
//     const token = req.header("Authorization").split(" ")[1];
//     console.log(token)
//     const decodedToken = jwt.verify(token, midToken);
//     const sentEmail = decodedToken.email;
//     if (req.body.user_email && req.body.user_email !== sentEmail) {
//       throw "Indalid User with email !";
//     } else {
//       req.user = decodedToken;
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error("Not Authorized!"),
//     });
//   }
// };



const jwt = require("jsonwebtoken");
const midToken = "blogging";

module.exports = (req, res, next) => {
  try {
    console.log("Middleware");
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw "Authorization header is missing!";
    }
    const token = authHeader.split(" ")[1];
    console.log(token)
    const decodedToken = jwt.verify(token, midToken);
    const sentEmail = decodedToken.email;
    if (req.body.user_email && req.body.user_email !== sentEmail) {
      throw "Invalid User with email!";
    } else {
      req.user = decodedToken;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Not Authorized!"),
    });
  }
};
