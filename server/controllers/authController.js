// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res) => {
  const { name, email, password, mobile, referralCode } = req.body;

  const userExists = await User.findOne({ mobile });
  if (userExists)
    return res.status(400).json({ message: 'User already exists' });

  let referredBy = null;

  // ✅ Check if referral code is valid
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });

    if (referrer) {
      referredBy = referralCode;
      referrer.points += 50; // ✅ Give referrer 50 points
      await referrer.save();
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    referredBy,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    isAdmin: user.isAdmin,
    referralCode: user.referralCode,
    token: generateToken(user._id),
  });
};


export const loginUser = async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isAdmin: user.isAdmin,
      address: user.address,
      referralCode: user.referralCode,
      points: user.points,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid mobile number or password' });
  }
};


export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateUserAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req.user._id);
  if (user) {
    user.address = req.body.address || user.address;
    await user.save();
    res.json({ message: 'Address updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.find().select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error while fetching user details' });
  }
};

// controllers/userController.js
export const getNewUsersToday = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const newUsers = await User.find({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    res.json({ count: newUsers.length });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new users' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = mobile || user.mobile;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      token: req.user.token, // existing token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
