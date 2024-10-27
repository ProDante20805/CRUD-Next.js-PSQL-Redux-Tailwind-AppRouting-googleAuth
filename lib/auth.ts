// lib/auth.ts
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

const secret = process.env.JWT_SECRET || 'dante';

interface CustomJwtPayload {
    exp?: number;
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return false;
    }
  
    return true;
  } catch (err) {
    return false;
  }
}
