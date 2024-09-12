import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token;

  // Check if the token is present in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the header
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    // If no token is found, respond with unauthorized status
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  try {
    // Verify the token using the secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.error("Token verification error:", error);
        // Respond with unauthorized status if token is invalid
        return res.status(401).json({ msg: "Invalid Authentication." });
      }
      console.log("Decoded role:", decoded.role);

      // Log the decoded user information for debugging
      console.log("Decoded User from Token:", decoded);

      // Attach the decoded user information to the request object
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Catch any other errors and respond with a server error status
    console.error("Unexpected error:", error);
    return res.status(500).json({ msg: error.message });
  }
};

export default auth;
