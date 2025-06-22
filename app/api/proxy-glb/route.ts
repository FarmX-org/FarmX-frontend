import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://f003.backblazeb2.com/file/farmx-assets/scenewithanimal.glb');
    if (!res.ok) {
      return NextResponse.error();
    }
    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
}
