import jwt, { verify } from "jsonwebtoken"
import { UnauthorizedError } from "./response"
import { NextRequest } from "next/server";

interface JwtPayload {
    userId: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
    type?: "access" | "refresh";
}

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH!

export function verifyAccessToken(req: NextRequest): JwtPayload {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        throw new UnauthorizedError("Access token missing");
    }
    try {
        const payload = verify(token, ACCESS_SECRET) as JwtPayload;
        if (payload.type && payload.type !== "access") {
            throw new UnauthorizedError("Invalid token type");
        }
        return payload;
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
}

export function verifyRefreshToken(token: string): JwtPayload {
    try {
        const payload = jwt.verify(token, REFRESH_SECRET) as JwtPayload;
        if (payload.type && payload.type !== "refresh") {
            throw new Error("Invalid token type");
        }
        return payload;
    } catch {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }
}