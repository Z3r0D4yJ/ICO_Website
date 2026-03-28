import { supabase } from '@/config/supabase'

// ── Public ──────────────────────────────────────────────────────────────────

export async function fetchPublishedProjects({ limit = 24, offset = 0, tag = null, serviceType = null } = {}) {
  let query = supabase
    .from('projects')
    .select('id, slug, title_nl, title_en, description_nl, description_en, cover_image_url, vehicle_type, vehicle_brand, service_type, tags, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (tag) query = query.contains('tags', [tag])
  if (serviceType) query = query.eq('service_type', serviceType)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) throw error
  return data
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, title_nl, is_published, vehicle_brand, service_type, published_at, created_at, cover_image_url, tags')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProject(data) {
  const { data: result, error } = await supabase
    .from('projects')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updateProject(id, data) {
  const { data: result, error } = await supabase
    .from('projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return result
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function toggleProjectPublish(id, isPublished) {
  const updates = {
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('projects').update(updates).eq('id', id)
  if (error) throw error
}

// ── Storage ──────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB voor hogere kwaliteit project foto's

export async function uploadProjectImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Alleen JPEG, PNG, WebP en GIF afbeeldingen zijn toegestaan')
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Afbeelding mag maximaal 10MB zijn')
  }
  const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
  const ext = extMap[file.type]
  const randomId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const filename = `${randomId}.${ext}`

  const { data, error } = await supabase.storage
    .from('projects')
    .upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(data.path)
  return publicUrl
}
