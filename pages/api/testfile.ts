import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // For download test, send a 1MB file
    const testData = Buffer.alloc(1024 * 1024, 'X');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(testData);
  } else if (req.method === 'POST') {
    // For upload test, just accept the data and send a response
    res.status(200).json({ message: 'Upload received' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
