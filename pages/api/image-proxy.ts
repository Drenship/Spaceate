import axios, { AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const imageUrl = req.query.imageUrl as string | undefined;

  if (!imageUrl) {
    res.status(400).json({ error: 'Image URL is required' });
    return;
  }

  try {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length']);
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching image' });
  }
};

export default handler;
