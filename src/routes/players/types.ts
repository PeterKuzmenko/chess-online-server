export type GetPlayersParams = {
  search?: string;
};

export type UpdateUserInfoPayload = {
  status: string;
  description: string;
};

export type ChangeUsernamePayload = {
  username: string;
};
