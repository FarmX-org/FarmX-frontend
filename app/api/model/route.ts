// /app/api/model/route.ts (or /pages/api/model.ts if using pages router)
export async function GET(req: Request) {
  const url = "https://github.com/FarmX-org/FarmX-frontend/releases/download/v1.0.0/scenewithanimal.glb";
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "model/gltf-binary",
      "Content-Length": buffer.byteLength.toString(),
    },
  });
}
