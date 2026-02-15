import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video', 'image', 'headshot'
    const providerId = formData.get('providerId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    // Validate file type
    if (!isVideo && !isImage) {
      return NextResponse.json({ error: 'Invalid file type. Only videos and images allowed.' }, { status: 400 });
    }

    // Validate file size
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      return NextResponse.json({ error: `File too large. Max size is ${maxMB}MB.` }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const folder = isVideo ? 'videos' : 'images';
    const filename = `providers/${providerId || 'general'}/${folder}/${timestamp}-${randomId}.${ext}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}
