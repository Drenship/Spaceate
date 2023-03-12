import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

type Props = {
    authOnly: boolean
    adminOnly: boolean
}

export const authSessionMiddleware = (authVerifyNeed: Props) => {
    return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {

        const session = await getSession({ req });

        if (authVerifyNeed.authOnly && (!session || (session && !session.user))) {
            return res.status(401).send('signin required');
        }

        if (authVerifyNeed.adminOnly && (!session || (session && !session.user.isAdmin))) {
            return res.status(401).send('signin required to admin');
        }

        if (session) {
            const { user } = session;
            if (session.user) {
                if (!req.body) {
                    req.body = {}
                }
                console.log(user)
                req.body.user = user
            }
        }

        next()
    }
}