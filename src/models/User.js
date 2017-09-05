import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO: add uniqueness and submit validations to email field
const schema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.generatorJWT = function generatorJWT() {
  return jwt.sign({
    email: this.email,
  }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generatorJWT(),
  };
};

export default mongoose.model('User', schema);
