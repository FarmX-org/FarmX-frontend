import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _req: NextApiRequest, // <-- حطينا _ قبل req لأنه مش مستخدم لتجنب التحذير
  res: NextApiResponse
) {
  const url =
    'https://github.com/FarmX-org/FarmX-frontend/releases/download/v1.0.0/scenewithanimal.glb';

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Content-Length', buffer.byteLength.toString());
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Failed to fetch GLB model:', error);
    res.status(500).json({ error: 'Failed to load model' });
  }
}
