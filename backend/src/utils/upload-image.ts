// utils/upload-image.ts
import * as https from 'https';
import * as querystring from 'querystring';

// Interface for imgbb API response
interface ImgbbResponse {
  data?: {
    url: string;
  };
  error?: {
    message: string;
  };
}

/**
 * Uploads a base64 encoded image to imgbb
 * @param base64Image - Base64 encoded image string
 * @returns URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadImage(base64Image: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('IMGBB_API_KEY not configured');
  }

  const postData = querystring.stringify({
    image: base64Image,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.imgbb.com',
      path: `/1/upload?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            throw new Error(
              `imgbb error ${res.statusCode}: ${res.statusMessage}`,
            );
          }

          const responseData: ImgbbResponse = JSON.parse(data);

          if (responseData.error) {
            throw new Error(responseData.error.message);
          }

          if (!responseData.data?.url) {
            throw new Error('No image URL returned from imgbb');
          }

          resolve(responseData.data.url);
        } catch (err) {
          console.error(
            'Image upload failed:',
            err instanceof Error ? err.message : String(err),
          );
          reject(new Error('Failed to upload image'));
        }
      });
    });

    req.on('error', (err) => {
      console.error('Image upload failed:', err.message);
      reject(new Error('Failed to upload image'));
    });

    req.write(postData);
    req.end();
  });
}
