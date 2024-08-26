import { NextApiRequest, NextApiResponse } from 'next';

const testServers = [
  'https://speed1.example.com',
  'https://speed2.example.com',
  'https://speed3.example.com',
  'https://speed4.example.com',
  'https://speed5.example.com',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(testServers);
}
