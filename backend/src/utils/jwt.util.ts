// src/utils/jwt.util.ts

import * as jwt from 'jsonwebtoken';
import { SignOptions, Secret, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'SECRET_KEY_123';
const JWT_EXPIRES_WEB_IN: number =
  Number(process.env.JWT_EXPIRES_WEB_IN) || 3600;
const JWT_EXPIRES_MOBILE_IN: number =
  Number(process.env.JWT_EXPIRES_MOBILE_IN) || 86400;
/**
 * Generate a JWT token for a given payload.
 * @param payload The user data to encode in token.
 * @returns JWT string
 */
export function generateToken(
  payload: object,
  clientType: string,
  tokenExpiry?: SignOptions['expiresIn'],
): string {
  let expiresIn = JWT_EXPIRES_WEB_IN;

  if (clientType === 'mobile') {
    expiresIn = JWT_EXPIRES_MOBILE_IN;
  }

  const options: SignOptions = {
    expiresIn: expiresIn,
    algorithm: 'HS512',
  };
  if (tokenExpiry) {
    options.expiresIn = tokenExpiry;
  }
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify a JWT token and return its payload.
 * @param token The JWT string from Authorization header.
 * @returns Decoded payload if valid.
 * @throws Error if invalid or expired.
 */
export function verifyToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload | string;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode a token without verifying (useful for debugging).
 */
export function decodeToken(
  token: string,
): null | { [key: string]: any } | string {
  return jwt.decode(token);
}
