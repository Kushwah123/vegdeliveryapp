
// // backend/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: String,
//   mobile: {
//   type: String,
//   required: true,
//   match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
// },
//   email: { type: String, unique: true },
//   password: String,
//   isAdmin: { type: Boolean, default: false },
//   address: String,
//   points: {
//   type: Number,
//   default: 0,
// },
// points: {
//   type: Number,
//   default: 0
// },
// referralCode: {
//   type: String,
//   unique: true
// },
// referredBy: {
//   type: String,
//   default: null
// }

// },
//  { timestamps: true });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// export default mongoose.model('User', userSchema);


// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    points: { type: Number, default: 0 },
    referralCode: {
      type: String,
      unique: true,
    },
    referredBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Password check method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Pre-save: Hash password + generate unique referral code
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // ✅ Generate referral code only if not present (new user)
  if (!this.referralCode) {
    this.referralCode =
      this.name.toLowerCase().replace(/\s+/g, '') +
      crypto.randomBytes(3).toString('hex'); // ex: "dharmendra1f2a3b"
  }

  next();
});

export default mongoose.model('User', userSchema);
