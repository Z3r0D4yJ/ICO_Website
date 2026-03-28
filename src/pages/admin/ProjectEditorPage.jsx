import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useUiStore } from '@/stores/uiStore'
import {
  ArrowLeft,
  Image,
  Upload,
  Save,
  Eye,
  CheckCircle2,
  Loader2,
  Trash2,
  Plus,
  X,
} from '@/lib/icons'
import { useAdminProject } from '@/hooks/useProjects'
import { createProject, updateProject, uploadProjectImage } from '@/api/projects'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { VEHICLE_TYPES, SERVICE_CATEGORIES } from '@/lib/constants'

// ── TagInput ──────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim().toLowerCase()
    if (!tag || tags.includes(tag)) { setInput(''); return }
    onChange([...tags, tag])
    setInput('')
  }

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag))

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-primary)' }}>
        Tags
      </label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ backgroundColor: 'rgba(196,130,111,0.12)', color: 'var(--color-primary)', border: '1px solid rgba(196,130,111,0.25)' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="cursor-pointer hover:opacity-70"
              aria-label={`Verwijder tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          placeholder="Nieuwe tag..."
          className="flex-1 h-9 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          style={{
            backgroundColor: 'var(--color-surface-overlay)',
            border: '1px solid rgba(196,130,111,0.2)',
            color: 'var(--color-text-primary)',
          }}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 h-9 rounded-md cursor-pointer transition-colors duration-150"
          style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(196,130,111,0.2)' }}
          aria-label="Tag toevoegen"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── ImageUploadButton ─────────────────────────────────────────────────────────

function ImageUploadButton({ onUpload, uploading, label = 'Afbeelding uploaden' }) {
  const inputRef = useRef(null)
  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center gap-2 py-6 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-50"
        style={{
          border: '2px dashed rgba(196,130,111,0.3)',
          backgroundColor: 'rgba(196,130,111,0.05)',
          color: 'var(--color-text-muted)',
        }}
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
        ) : (
          <>
            <Upload className="w-6 h-6" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            <span className="text-sm">{label}</span>
            <span className="text-xs">JPG, PNG, WebP — max 10MB</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
        aria-hidden="true"
      />
    </>
  )
}

// ── CoverImageUpload ──────────────────────────────────────────────────────────

function CoverImageUpload({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const showError = useUiStore((s) => s.showError)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadProjectImage(file)
      onChange(url)
    } catch (err) {
      const msg = err?.message || 'Upload mislukt'
      setError(msg)
      showError(msg, 'Upload mislukt')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-primary)' }}>
        Cover afbeelding
      </label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-between gap-2 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              Vervangen
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}
              aria-label="Cover verwijderen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <ImageUploadButton onUpload={handleFile} uploading={uploading} label="Klik om cover te uploaden" />
      )}
      {error && <p className="text-xs mt-1.5" style={{ color: 'var(--color-error)' }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-hidden="true" />
    </div>
  )
}

// ── GalleryUpload ─────────────────────────────────────────────────────────────

function GalleryUpload({ images, onChange }) {
  const [uploading, setUploading] = useState(false)
  const showError = useUiStore((s) => s.showError)

  const handleFiles = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadProjectImage(f)))
      onChange([...images, ...urls])
    } catch (err) {
      showError(err?.message || 'Upload mislukt', 'Upload mislukt')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }, [images, onChange, showError])

  const removeImage = (index) => onChange(images.filter((_, i) => i !== index))

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-primary)' }}>
        Galerij foto&apos;s
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((url, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden group" style={{ aspectRatio: '4/3' }}>
              <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}
                aria-label={`Verwijder foto ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <ImageUploadButton onUpload={handleFiles} uploading={uploading} label="Foto's toevoegen (meerdere mogelijk)" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProjectEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { project, loading: loadingProject } = useAdminProject(isEdit ? id : null)

  const [title, setTitle] = useState('')
  const [slug, setSlugState] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [descriptionNl, setDescriptionNl] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [images, setImages] = useState([])
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [tags, setTags] = useState([])
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedState, setSavedState] = useState(null)
  const showError = useUiStore((s) => s.showError)
  const showSuccess = useUiStore((s) => s.showSuccess)

  // Laad bestaand project bij edit
  useEffect(() => {
    if (!project) return
    setTitle(project.title_nl || '')
    setSlugState(project.slug || '')
    setSlugManual(true)
    setDescriptionNl(project.description_nl || '')
    setDescriptionEn(project.description_en || '')
    setCoverImageUrl(project.cover_image_url || '')
    setImages(project.images || [])
    setVehicleBrand(project.vehicle_brand || '')
    setVehicleType(project.vehicle_type || '')
    setServiceType(project.service_type || '')
    setTags(project.tags || [])
    setIsPublished(project.is_published || false)
  }, [project])

  // Auto-slug van titel
  useEffect(() => {
    if (!slugManual && title) {
      setSlugState(slugify(title))
    }
  }, [title, slugManual])

  const handleSave = async (publish = null) => {
    if (!title.trim()) return
    setSaving(true)
    setSavedState(null)

    const willPublish = publish !== null ? publish : isPublished

    const payload = {
      title_nl: title.trim(),
      slug: slug.trim() || slugify(title.trim()),
      description_nl: descriptionNl.trim() || null,
      description_en: descriptionEn.trim() || null,
      cover_image_url: coverImageUrl || null,
      images: images,
      vehicle_brand: vehicleBrand.trim() || null,
      vehicle_type: vehicleType || null,
      service_type: serviceType || null,
      tags: tags,
      is_published: willPublish,
      published_at: willPublish ? (project?.published_at || new Date().toISOString()) : null,
    }

    try {
      if (isEdit) {
        await updateProject(id, payload)
      } else {
        const created = await createProject(payload)
        navigate(`/admin/projecten/${created.id}/edit`, { replace: true })
      }
      setIsPublished(willPublish)
      setSavedState('saved')
      showSuccess(willPublish ? 'Project gepubliceerd!' : 'Concept opgeslagen', '')
      setTimeout(() => setSavedState(null), 3000)
    } catch (err) {
      setSavedState('error')
      showError(err?.message || 'Opslaan mislukt', 'Fout')
    } finally {
      setSaving(false)
    }
  }

  const selectStyle = {
    height: '2.5rem',
    width: '100%',
    padding: '0 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'var(--color-surface-overlay)',
    border: '1px solid rgba(196,130,111,0.2)',
    color: 'var(--color-text-primary)',
    outline: 'none',
  }

  if (loadingProject) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-32 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface-elevated)' }} />
          <div className="flex-1" />
          <div className="h-9 w-24 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface-elevated)' }} />
          <div className="h-9 w-28 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface-elevated)' }} />
        </div>
        <div className="h-64 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface-elevated)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/admin/projecten"
          className="flex items-center gap-1.5 text-sm cursor-pointer transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Projecten
        </Link>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {savedState === 'saved' && (
            <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-success)' }}>
              <CheckCircle2 className="w-4 h-4" />
              Opgeslagen
            </span>
          )}
          {savedState === 'error' && (
            <span className="text-sm" style={{ color: 'var(--color-error)' }}>Opslaan mislukt</span>
          )}

          <Badge variant={isPublished ? 'success' : 'neutral'} size="sm">
            {isPublished ? 'Gepubliceerd' : 'Concept'}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            disabled={saving || !title.trim()}
            onClick={() => handleSave(false)}
            leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {isPublished ? 'Opslaan' : 'Opslaan als concept'}
          </Button>

          {!isPublished ? (
            <Button
              variant="primary"
              size="sm"
              disabled={saving || !title.trim()}
              onClick={() => handleSave(true)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Publiceren
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={saving || !title.trim()}
              onClick={() => handleSave(true)}
            >
              Bijwerken
            </Button>
          )}
        </div>
      </div>

      {/* Twee-kolom layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* Links — tekst info */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          {/* Titel */}
          <div className="p-5 pb-4 border-b" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel van het project..."
              rows={2}
              className="w-full resize-none bg-transparent border-none outline-none text-2xl font-semibold placeholder:text-[var(--color-text-muted)]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                color: 'var(--color-text-primary)',
                lineHeight: 1.3,
              }}
            />
            {/* Slug preview */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/projecten/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlugState(e.target.value) }}
                className="text-xs bg-transparent border-none outline-none flex-1 min-w-0"
                style={{ color: 'var(--color-primary)' }}
                placeholder="url-slug"
                aria-label="URL slug"
              />
            </div>
          </div>

          {/* Beschrijvingen */}
          <div className="p-5 space-y-5">
            <Textarea
              label="Beschrijving (NL)"
              rows={5}
              value={descriptionNl}
              onChange={(e) => setDescriptionNl(e.target.value)}
              placeholder="Beschrijf het project in het Nederlands..."
            />
            <Textarea
              label="Beschrijving (EN)"
              rows={5}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Describe the project in English..."
              hint="Optioneel — valt terug op NL als leeg"
            />
          </div>
        </div>

        {/* Rechts — instellingen */}
        <div className="space-y-4">
          {/* Cover afbeelding */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
          </div>

          {/* Galerij */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <GalleryUpload images={images} onChange={setImages} />
          </div>

          {/* Voertuig info */}
          <div
            className="rounded-xl p-4 space-y-4"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <Input
              label="Voertuigmerk"
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              placeholder="bv. BMW, Mercedes, Audi..."
            />

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-primary)' }}>
                Voertuigtype
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={selectStyle}
              >
                <option value="">— Selecteer type —</option>
                {VEHICLE_TYPES.map(({ value, label_nl }) => (
                  <option key={value} value={value}>{label_nl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--color-text-primary)' }}>
                Dienst
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                style={selectStyle}
              >
                <option value="">— Selecteer dienst —</option>
                {SERVICE_CATEGORIES.map(({ value, label_nl }) => (
                  <option key={value} value={value}>{label_nl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid rgba(196,130,111,0.2)' }}
          >
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>
      </div>
    </div>
  )
}
