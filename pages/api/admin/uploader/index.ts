import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { FileInfo } from '@libs/typings';
import { generateUUID } from '@libs/utils';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = generateUUID();
            const fileExtension = path.extname(file.originalname);
            cb(null, uniqueSuffix + fileExtension);
        },
    }),
});

const apiRoute = nextConnect({
    onError(error, req, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(authSessionMiddleware({ authOnly: true, adminOnly: true }));
apiRoute.use(upload.any());

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse<{ files: FileInfo[] } | any>) => {
    try {
        const files = req.files as Express.Multer.File[];
        const fileData = await Promise.all(files.map(async (file) => {
            const { size, mimetype, filename } = file;
            const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
            const url = `uploads/${filename}`;
            const stats = await fs.promises.stat(filePath);
            const uploadedAt = stats.mtime;
            return { name: filename, size, url, mimetype, uploadedAt };
        }));
        res.status(200).json({ files: fileData });
    } catch (error) {
        res.status(500).json(error);
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};