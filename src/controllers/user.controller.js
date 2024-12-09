const UserServices = require("../services/user.services");
const UserModel  = require("../models/user");
const appResponse = require("../utils/appResponse");

// only client will use this method to create a new register
const demoRequest = async (req, res) => {
  res.send("This is User route!");
};

// Register a new user
const register = async (req, res) => {
  try {
    const { password, email, firstName, lastName } = req.body;

    // Get user with email
    const userExist = await UserModel.findOne({ email: email });

    // check if there is a user with the same email
    if (userExist)
      return res.status(400).send(appResponse("Email exists already.", false));

    // encrypt the password
    const { content, iv } = await UserServices.encrypt(password);

    // create a new user
    const user = new UserModel({
      email,
      hashedPassword: content,
      iv,
      firstName,
      lastName,
    });
    await user.save();

    res.status(201).send({ success: true });
  } catch (err) {
    console.error(err);
    const response = appResponse("Error registering user.", false);
    res.status(500).send(response);
  }
};

// Login the user
const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Get user with email
    const user = await UserModel.findOne({ email: email });

    // check if there is a user with the same email
    if (!user)
      return res.status(401).send(appResponse("Invalid Credentials.", false));

    // verify the password
    const isValidCred = await UserServices.verifyPassword(
      { content: user.hashedPassword, iv: user.iv },
      password
    );

    if (!isValidCred)
      return res.status(401).send(appResponse("Invalid Credentials.", false));

    // generate token for authenticated user
    const token = UserServices.generateAuthToken({
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      id: user.id,
      role: user.role,
    });

    res.status(201).send({ token });
  } catch (err) {
    console.log(err);
    const response = appResponse("Error logging user.", false);
    res.status(500).send(response);
  }
};

// Controller function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

module.exports = { demoRequest, register, login, getAllUsers };
