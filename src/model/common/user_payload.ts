export interface UserPayload {
  userId: number;
  socketId: string;
  issuedAt?: number;
  expirationTime?: number;
}
