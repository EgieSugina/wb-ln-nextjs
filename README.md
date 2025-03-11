# Light Novel Web Application

A web application for managing and reading light novels, built with Next.js, Prisma, GraphQL, and shadcn/ui.

## Features

- Browse and read light novels
- Add, edit, and delete novels, chapters, and genres
- Rich text editor for chapter content
- Image upload for novel covers
- User-friendly interface

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- SQLite (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-light-novel.git
   cd web-light-novel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Create a `.env.local` file based on `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Google Cloud Storage for Image Uploads

To enable image uploads for novel covers, you need to set up Google Cloud Storage:

1. Create a Google Cloud account if you don't have one: [https://cloud.google.com/](https://cloud.google.com/)

2. Create a new project in the Google Cloud Console.

3. Enable the Cloud Storage API for your project.

4. Create a storage bucket:
   - Go to Cloud Storage > Buckets
   - Click "Create Bucket"
   - Name your bucket (e.g., "light-novel-images")
   - Choose a location
   - Click "Create"

5. Check if Public Access Prevention is enabled:
   - Go to your bucket's details
   - Look for "Public access prevention" in the Configuration tab
   - If it says "Enforced", you'll need to use signed URLs (see troubleshooting section below)

6. Configure bucket access control (if Public Access Prevention is NOT enforced):

   **Option A: Use Fine-grained access control**
   - Go to your bucket > Permissions
   - Look for "Access control" section
   - Change from "Uniform" to "Fine-grained" access control
   - Save the changes
   - Then add a new member: `allUsers`
   - Assign the role: "Storage Object Viewer"

   **Option B: Use Uniform bucket-level access**
   - Keep the default "Uniform" access control
   - Go to your bucket > Permissions
   - Click "Grant Access"
   - Add a new principal: `allUsers`
   - Assign the role: "Storage Object Viewer"

7. Create a service account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name your service account (e.g., "light-novel-storage")
   - Assign the role: "Storage Admin"
   - Click "Create"

8. Create a key for your service account:
   - Click on your service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file

9. Update your `.env.local` file with your Google Cloud configuration:
   ```
   GOOGLE_CLOUD_PROJECT_ID="your-project-id"
   GOOGLE_CLOUD_BUCKET_NAME="your-bucket-name"
   GOOGLE_APPLICATION_CREDENTIALS="path/to/your-service-account-key.json"
   ```

10. For production deployment, you can set the `GOOGLE_CLOUD_CREDENTIALS` environment variable with the contents of your service account key file as a JSON string.

## Troubleshooting Google Cloud Storage

### Error: "Cannot update access control for an object when uniform bucket-level access is enabled"

If you encounter this error, it means your bucket has uniform bucket-level access enabled, and the application is trying to set ACLs on individual objects. To fix this:

1. **Option 1:** Change your bucket to use fine-grained access control (see Option A above)
2. **Option 2:** Keep uniform access control but make sure the entire bucket is publicly readable (see Option B above)

### Error: "The member bindings allUsers and allAuthenticatedUsers are not allowed since public access prevention is enforced"

This error occurs when your Google Cloud project or organization has "Public Access Prevention" enforced. This is a security feature that prevents making data publicly accessible. You have several options:

1. **Option 1: Disable Public Access Prevention for your bucket** (if you have admin permissions)
   - Go to your bucket's details
   - Click on the "Configuration" tab
   - Find "Public access prevention" and click "Edit"
   - Change from "Enforced" to "Inherited"
   - Save changes

2. **Option 2: Use signed URLs** (already implemented in the application)
   - The application will automatically fall back to using signed URLs if it detects Public Access Prevention
   - These URLs will expire after 7 days by default
   - Note that this means older images might become inaccessible after the URL expires

3. **Option 3: Set up a Cloud CDN or Cloud Load Balancer** (advanced)
   - For a production environment, you might want to set up a more robust solution
   - This involves creating a backend service and setting up a CDN
   - This is beyond the scope of this README

## Technologies Used

- Next.js 13 (App Router)
- Prisma with SQLite
- Apollo GraphQL
- shadcn/ui components
- Tailwind CSS
- Tiptap rich text editor
- Google Cloud Storage for image uploads

## License

This project is licensed under the MIT License - see the LICENSE file for details.
