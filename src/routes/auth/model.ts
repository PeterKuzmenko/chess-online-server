import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: 'string', unique: true, required: true },
  password: { type: 'string', required: true },
});
export const User = model('User', UserSchema);
