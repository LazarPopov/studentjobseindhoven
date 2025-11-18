// src/lib/storage.ts
import { supabase } from './supabase';

const BUCKET_NAME = 'employer-logos';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function uploadLogo(
  fileBuffer: Buffer, 
  originalName: string,
  mimeType: string,
  companyName: string
): Promise<string> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  // Validate file size
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${sanitizedCompanyName}-${timestamp}.${fileExt}`;

  // Upload to Supabase Storage with Buffer
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[STORAGE_UPLOAD_ERROR]', error);
    throw new Error('Failed to upload logo. Please try again.');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteLogo(url: string): Promise<void> {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('[STORAGE_DELETE_ERROR]', error);
    }
  } catch (err) {
    console.error('[STORAGE_DELETE_ERROR]', err);
  }
}

