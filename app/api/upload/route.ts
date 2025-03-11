import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

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

// Duration for signed URLs (in seconds)
const SIGNED_URL_EXPIRATION = 7 * 24 * 60 * 60; // 7 days

export async function POST(request: NextRequest) {
  try {
    // Check if storage is initialized
    if (!storage) {
      return NextResponse.json(
        { error: 'Google Cloud Storage not initialized' },
        { status: 500 }
      );
    }

    // Get the bucket
    const bucket = storage.bucket(bucketName);

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `novel-covers/${fileName}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a new blob in the bucket
    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.type,
      },
    });

    // Return a promise that resolves when the file is uploaded
    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Error uploading to Google Cloud Storage:', err);
        resolve(NextResponse.json(
          { error: `Error uploading file: ${err.message}` },
          { status: 500 }
        ));
      });

      blobStream.on('finish', async () => {
        try {
          let fileUrl;
          
          // First try to make the file public (works only with fine-grained access control)
          try {
            await blob.makePublic();
            // If successful, use the public URL
            fileUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
            console.log('File made public successfully');
          } catch (error: any) {
            console.log(`Could not make file public: ${error.message}`);
            
            // If we can't make it public, generate a signed URL
            if (error.message.includes('public access prevention') || 
                error.message.includes('uniform bucket-level access')) {
              // Generate a signed URL that expires after a set time
              const [signedUrl] = await blob.getSignedUrl({
                action: 'read',
                expires: Date.now() + SIGNED_URL_EXPIRATION * 1000,
              });
              fileUrl = signedUrl;
              console.log('Generated signed URL instead');
            } else {
              // If it's another error, throw it
              throw error;
            }
          }

          resolve(NextResponse.json({ url: fileUrl }));
        } catch (error: any) {
          console.error('Error processing uploaded file:', error);
          resolve(NextResponse.json(
            { error: `Error processing file: ${error.message}` },
            { status: 500 }
          ));
        }
      });

      blobStream.end(buffer);
    });
  } catch (error: any) {
    console.error('Error in upload API route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
} 