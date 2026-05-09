import { createClient } from '@supabase/supabase-js'

// Server-side client (with service key for admin operations)
export function createServerSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Client-side client (with anon key)
export function createClientSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!
  )
}

const BUCKET_NAME = 'resumes'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadResumeFile(
  file: Buffer,
  fileName: string,
  userId: string,
  mimeType: string
): Promise<{ url: string; path: string }> {
  const supabase = createServerSupabase()
  const ext = fileName.split('.').pop()?.toLowerCase()
  const storagePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: signedUrl } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365) // 1 year

  if (!signedUrl?.signedUrl) throw new Error('Failed to generate signed URL')

  return {
    url: signedUrl.signedUrl,
    path: storagePath,
  }
}

export async function deleteResumeFile(path: string): Promise<void> {
  const supabase = createServerSupabase()
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export function validateFileType(mimeType: string): boolean {
  const allowed = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ]
  return allowed.includes(mimeType)
}

export function validateFileSize(sizeBytes: number): boolean {
  return sizeBytes <= MAX_FILE_SIZE
}
