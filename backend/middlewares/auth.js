import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token;

  // if authorization header is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // extracting the token from the header
      token = req.headers.authorization.split(" ")[1];

      // verifying the token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error)
          return res.status(400).json({ msg: "Invalid Authentication." });

        req.user = user;

        next();
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

export default auth;
