import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://f003.backblazeb2.com/file/farmx-assets/scenewithanimal.glb');
    if (!res.ok) {
      return new NextResponse('Failed to fetch model', { status: 500 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': buffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
