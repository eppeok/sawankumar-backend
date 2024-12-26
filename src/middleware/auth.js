const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const config = require("../config");

// Middleware to authenticate requests using JWT
const auth = async (req, res, next) => {
  try {
    // Get token from request header and remove "bearer " prefix if present
    const token = req.header("authentication")?.replace("bearer ", "");

    if (!token) {
      throw new Error("Token should be provided in the header of the request.");
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!decoded || !decoded.id) {
      throw new Error("Verifying token failed.");
    }

    // Find user by the ID in the token
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new Error("No user matches the ID in the token.");
    }

    // Inject token and user in the request object
    req.token = token;
    req.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    next(); // Continue to the next middleware
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
