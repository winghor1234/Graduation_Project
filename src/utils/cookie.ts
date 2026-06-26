import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { JwtPayload } from "@/types/jwt";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET_REFRESH;

interface AuthCookieParams {
    response: NextResponse;
    accessToken: string;
    refreshToken: string;
}

export function setAuthCookies({ response, accessToken, refreshToken }: AuthCookieParams) {
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 30 // 30 minutes
        // maxAge: 60 * 2 // 2 minutes
    });

    response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

}

export function getAuthCookies(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value || null;
    const refreshToken = request.cookies.get("refresh_token")?.value || null;

    return { accessToken, refreshToken };
}

export async function getUserFromToken(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value
    if (!token) {
        throw new Error("Unauthorized")
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify<JwtPayload>(token, secret);
        // console.log("payload : ", payload)
        return {
            id: payload.userId as string,
            role: payload.role as string
        }

    } catch (error) {
        console.log(error)
         throw new Error("Invalid token")
    }
}

export function clearAuthCookies(response: NextResponse) {
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("access_token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        expires: new Date(0)
    });
    response.cookies.set("refresh_token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        expires: new Date(0)
    });
}

export function generateAccessToken(userId: string, role: string): string {
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    try {
        const token = jwt.sign(
            {
                userId: userId,
                role: role,
                type: 'access',
            },
            ACCESS_TOKEN_SECRET,
            {
                // expiresIn: "15m",
                expiresIn: "15m",
                algorithm: 'HS256'
            }
        );
        return token;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Error generating access token");
    }
}

export function generateRefreshToken(userId: string): string {
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    try {
        const token = jwt.sign(
            {
                userId,
                type: 'refresh',
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
                algorithm: 'HS256'
            }
        );
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Error generating refresh token");
    }
}

