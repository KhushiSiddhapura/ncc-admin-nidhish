const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

const generateToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const safeUser = (user) => ({
  id: user._id, name: user.name, email: user.email, role: user.role, college: user.college,
});

const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw { status: 400, message: 'Email already registered' };
  const user = await User.create(data);
  return { user: safeUser(user), token: generateToken(user) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    throw { status: 401, message: 'Invalid credentials' };
  return { user: safeUser(user), token: generateToken(user) };
};

const logoutUser = async (token) => {
  await BlacklistedToken.create({ token });
};

module.exports = { registerUser, loginUser, logoutUser };
