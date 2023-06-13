import { Schema, model } from 'mongoose';

const PlayerSchema = new Schema({
  userId: { type: 'string', unique: true, required: true },
  username: { type: 'string', unique: true, required: true },
  status: { type: 'string', default: '' },
  description: { type: 'string', default: '' },
  avatarUrl: { type: 'string', required: false },
  playedGames: { type: 'number', default: 0 },
  rating: { type: 'number', default: 0 },
  accountCreated: { type: 'string', required: true },
  friendsIds: { type: Array, default: [] },
  followersIds: { type: Array, default: [] },
});
export const Player = model('Player', PlayerSchema);
