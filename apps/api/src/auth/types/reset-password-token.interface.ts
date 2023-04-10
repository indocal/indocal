export interface ResetPasswordToken {
  token: string; // AuthenticatedUser
  expiresAt: Date;
}

export default ResetPasswordToken;
