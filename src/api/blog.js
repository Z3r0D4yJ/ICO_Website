import { supabase } from '@/config/supabase'

// ── Public ──────────────────────────────────────────────────────────────────

export async function fetchPublishedPosts({ limit = 12, offset = 0, tag = null } = {}) {
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title_nl, title_en, excerpt_nl, excerpt_en, cover_image_url, author, published_at, tags')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (tag) query = query.contains('tags', [tag])
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) throw error
  return data
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title_nl, is_published, author, published_at, created_at, tags')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createPost(data) {
  const { data: result, error } = await supabase
    .from('blog_posts')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updatePost(id, data) {
  const { data: result, error } = await supabase
    .from('blog_posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return result
}

export async function deletePost(id) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublish(id, isPublished) {
  const updates = {
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
  if (error) throw error
}

// ── Storage ──────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadBlogImage(file) {
  // Valideer MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Alleen JPEG, PNG, WebP en GIF afbeeldingen zijn toegestaan')
  }
  // Valideer bestandsgrootte
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Afbeelding mag maximaal 5MB zijn')
  }
  // Gebruik MIME type voor extensie (niet user-supplied filename)
  const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
  const ext = extMap[file.type]
  const randomId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const filename = `${randomId}.${ext}`

  const { data, error } = await supabase.storage
    .from('blog')
    .upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('blog').getPublicUrl(data.path)
  return publicUrl
}
