import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "session";
const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET nije podešen u .env");
  return new TextEncoder().encode(secret);
}

export async function checkPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) throw new Error("ADMIN_PASSWORD_HASH nije podešen u .env");
  return bcrypt.compare(password, hash);
}

export async function createSession(res: Response) {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    // Na Vercel-u sajt ide preko HTTPS-a, pa kolačić šaljemo samo preko šifrovane veze.
    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE_NAME);
}

export async function isLoggedIn(req: Request): Promise<boolean> {
  const token: unknown = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") return false;

  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (await isLoggedIn(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Moraš biti prijavljen" });
}