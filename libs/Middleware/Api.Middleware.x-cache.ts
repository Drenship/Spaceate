import { NextApiRequest, NextApiResponse } from 'next'

const cache = new Map()

export const cacheMiddleware = (duration: number) => {
    return (req: NextApiRequest, res: NextApiResponse, next: Function) => {
        if (req.method !== 'GET') {
            console.log("call cache api is not get method", new Date())
            next()
            return
        }

        const cacheControl = res.getHeader('Cache-Control')
        if (cacheControl && cacheControl.includes('no-cache')) {
            console.log("call cache api don't have Cache-Control", new Date())
            next()
            return
        }

        const key = req.url
        const cachedResponse = cache.get(key)
        const currentDate = Date.now();
        if (cachedResponse && currentDate <= cachedResponse.expirationDate) {
            console.log("x-cache called", new Date())
            res.setHeader('x-cache', 'HIT')
            res.setHeader('x-cache-update-at', cachedResponse.lastUpdate)
            res.setHeader('x-cache-expire-at', cachedResponse.expirationDate)
            res.send(cachedResponse.data)
            return
        }

        res.sendResponse = res.status(200).send
        res.send = (body: any) => {
            console.log("set cache", new Date())
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(key, {
                    data: body,
                    lastUpdate: Date.now(),
                    expirationDate: Date.now() + (duration * 1000)
                });
                res.setHeader('x-cache', 'MISS')
            }
            res.sendResponse(body)
        }

        next()
    }
}