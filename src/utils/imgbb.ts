import { env } from "../config/env";

export async function uploadToImgbb(base64Image: string): Promise<string> {
  const form = new FormData();
  form.append("image", base64Image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${env.IMGBB_API_KEY}`, {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as { success: boolean; data?: { url: string } };
  if (!data.success || !data.data) {
    throw new Error("Image upload failed");
  }
  return data.data.url;
}