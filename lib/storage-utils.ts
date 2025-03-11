import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
let storage: Storage;
try {
  // If running in production, use the credentials from environment variables
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    storage = new Storage({
      credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
  } else {
    // For local development, use the credentials file
    storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
  }
} catch (error) {
  console.error('Error initializing Google Cloud Storage:', error);
}

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'light-novel-images';

/**
 * Extracts the filename from a Google Cloud Storage URL
 * @param url The full URL of the image
 * @returns The file path relative to the bucket
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    // Handle both public URLs and signed URLs
    if (url.includes(`storage.googleapis.com/${bucketName}/`)) {
      // For public URLs: https://storage.googleapis.com/bucket-name/path/to/file.jpg
      const regex = new RegExp(`storage\\.googleapis\\.com\\/${bucketName}\\/(.+)`);
      const match = url.match(regex);
      return match ? match[1] : null;
    } else if (url.includes(`${bucketName}.storage.googleapis.com/`)) {
      // Alternative URL format: https://bucket-name.storage.googleapis.com/path/to/file.jpg
      const regex = new RegExp(`${bucketName}\\.storage\\.googleapis\\.com\\/(.+)`);
      const match = url.match(regex);
      return match ? match[1] : null;
    } else if (url.includes('googleusercontent.com')) {
      // For signed URLs: https://storage.googleapis.com/download/storage/v1/b/bucket-name/o/path%2Fto%2Ffile.jpg?...
      const regex = /\/o\/([^?]+)/;
      const match = url.match(regex);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
}

/**
 * Moves a file to the deleted folder in Google Cloud Storage
 * @param imageUrl The URL of the image to move
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function moveImageToDeletedFolder(imageUrl: string | null | undefined): Promise<boolean> {
  if (!imageUrl) return false;
  if (!storage) {
    console.error('Google Cloud Storage not initialized');
    return false;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const filePath = extractFilePathFromUrl(imageUrl);
    
    if (!filePath) {
      console.error('Could not extract file path from URL:', imageUrl);
      return false;
    }

    // Create destination path in the deleted folder
    const fileName = filePath.split('/').pop();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const destinationPath = `deleted/${timestamp}_${fileName}`;

    // Copy the file to the deleted folder
    await bucket.file(filePath).copy(bucket.file(destinationPath));
    
    // Delete the original file
    await bucket.file(filePath).delete();
    
    console.log(`Moved ${filePath} to ${destinationPath}`);
    return true;
  } catch (error) {
    console.error('Error moving file to deleted folder:', error);
    return false;
  }
}

export { storage, bucketName }; 