// rateLimiter.ts
import { NextRequest } from 'next/server';

const rateLimitWindowMs = 1 * 60 * 1000; // 1 minute
const rateLimitMax = 150; // limit each IP to 5 requests per windowMs

const ipRequestCounts: { [key: string]: { count: number; expiresAt: number } } = {};

export async function rateLimiter(req: NextRequest): Promise<boolean> {
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for');

    if (!ip) {
        return false;
    }

    const currentTime = Date.now();

    if (ipRequestCounts[ip] && ipRequestCounts[ip].expiresAt > currentTime) {
        ipRequestCounts[ip].count += 1;
    } else {
        ipRequestCounts[ip] = { count: 1, expiresAt: currentTime + rateLimitWindowMs };
    }

    if (ipRequestCounts[ip].count > rateLimitMax) {
        return false;
    }

    return true;
}
