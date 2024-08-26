import { NextApiRequest, NextApiResponse } from 'next';

const testServers = [
 'https://speed.hetzner.de/100MB.bin',
  'https://proof.ovh.net/files/100Mb.dat',
  'https://files.jkdesign.xyz/100mb.zip',
  'https://sanog.org/resources/100MB.test',
  'https://bms24bg.com/download/100MB.bin',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(testServers);
}
