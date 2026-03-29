import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useUiStore } from '@/stores/uiStore'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import TipTapLink from '@tiptap/extension-link'
import {
  ArrowLeft,
  Bold,
  Italic,
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
import { useAdminBlogPost } from '@/hooks/useBlog'
import { createPost, updatePost, uploadBlogImage } from '@/api/blog'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

// ── Toolbar button ────────────────────────────────────────────────────────────

function ToolbarBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 disabled:opacity-40"
      style={
        active
          ? { backgroundColor: 'rgba(196,130,111,0.2)', color: 'var(--color-primary)' }
          : { color: 'var(--color-text-muted)' }
      }
    >
      {children}
    </button>
  )
}

function ToolbarSep() {
  return <div className="w-px h-5 mx-1" style={{ backgroundColor: 'rgba(196,130,111,0.2)' }} aria-hidden="true" />
}

// ── Editor toolbar ────────────────────────────────────────────────────────────

function EditorToolbar({ editor, onImageUpload }) {
  const imageInputRef = useRef(null)

  const handleLinkInsert = useCallback(() => {
    const url = window.prompt('URL invoeren:', 'https://')
    if (!url) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b"
      style={{ borderColor: 'rgba(196,130,111,0.2)' }}
    >
      {/* Heading H2 */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Kop 2 (H2)"
      >
        <span className="text-xs font-bold">H2</span>
      </ToolbarBtn>

      {/* Heading H3 */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Kop 3 (H3)"
      >
        <span className="text-xs font-bold">H3</span>
      </ToolbarBtn>

      <ToolbarSep />

      {/* Bold */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Vet (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" weight="bold" />
      </ToolbarBtn>

      {/* Italic */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Cursief (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </ToolbarBtn>

      <ToolbarSep />

      {/* Bullet list */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Lijst met opsommingstekens"
      >
        <span className="text-xs font-bold">• —</span>
      </ToolbarBtn>

      {/* Ordered list */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Genummerde lijst"
      >
        <span className="text-xs font-bold">1.</span>
      </ToolbarBtn>

      {/* Blockquote */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Citaat"
      >
        <span className="text-base leading-none">"</span>
      </ToolbarBtn>

      <ToolbarSep />

      {/* Link */}
      <ToolbarBtn
        onClick={handleLinkInsert}
        active={editor.isActive('link')}
        title="Link invoegen"
      >
        <span className="text-xs font-bold underline">URL</span>
      </ToolbarBtn>

      {/* Horizontale lijn */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontale lijn"
      >
        <span className="text-xs font-bold">—</span>
      </ToolbarBtn>

      <ToolbarSep />

      {/* Afbeelding uploaden */}
      <ToolbarBtn onClick={() => imageInputRef.current?.click()} title="Afbeelding invoegen">
        <Image className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageUpload}
        aria-hidden="true"
      />
    </div>
  )
}

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
      const url = await uploadBlogImage(file)
      onChange(url)
    } catch (err) {
      const msg = err?.message || 'Upload mislukt'
      setError(msg)
      showError(msg, 'Upload mislukt')
      console.error('Cover upload failed:', err)
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
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center gap-2 py-8 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-80"
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
              <span className="text-sm">Klik om cover te uploaden</span>
              <span className="text-xs">JPG, PNG, WebP</span>
            </>
          )}
        </button>
      )}
      {error && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        aria-hidden="true"
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BlogEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const { post, loading: loadingPost } = useAdminBlogPost(isEdit ? id : null)

  const [title, setTitle] = useState('')
  const [slug, setSlugState] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [tags, setTags] = useState([])
  const [author, setAuthor] = useState('Team ICO')
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedState, setSavedState] = useState(null) // 'saved' | 'error'
  const [imageUploading, setImageUploading] = useState(false)
  const showError = useUiStore((s) => s.showError)
  const showSuccess = useUiStore((s) => s.showSuccess)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapImage.configure({ inline: false, allowBase64: false }),
      TipTapLink.configure({ openOnClick: false, autolink: true }),
    ],
    content: '',
    editorProps: {
      attributes: { class: 'tiptap-editor-content' },
    },
  })

  // Laad bestaande post bij edit
  useEffect(() => {
    if (!post || !editor) return
    setTitle(post.title_nl || '')
    setSlugState(post.slug || '')
    setSlugManual(true)
    setExcerpt(post.excerpt_nl || '')
    setCoverImageUrl(post.cover_image_url || '')
    setTags(post.tags || [])
    setAuthor(post.author || 'Team ICO')
    setIsPublished(post.is_published || false)
    editor.commands.setContent(post.content_nl || '')
  }, [post, editor])

  // Auto-slug van titel
  useEffect(() => {
    if (!slugManual && title) {
      setSlugState(slugify(title))
    }
  }, [title, slugManual])

  const handleImageInEditor = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file || !editor) return
    setImageUploading(true)
    try {
      const url = await uploadBlogImage(file)
      editor.chain().focus().setImage({ src: url, alt: file.name }).run()
    } catch (err) {
      const msg = err?.message || 'Upload mislukt'
      showError(msg, 'Afbeelding upload mislukt')
      console.error('Image upload failed:', err)
    } finally {
      setImageUploading(false)
      e.target.value = ''
    }
  }, [editor, showError])

  const handleSave = async (publish = null) => {
    if (!title.trim()) return
    setSaving(true)
    setSavedState(null)

    const willPublish = publish !== null ? publish : isPublished
    const content = editor ? editor.getHTML() : ''

    const payload = {
      title_nl: title.trim(),
      slug: slug.trim() || slugify(title.trim()),
      excerpt_nl: excerpt.trim() || null,
      content_nl: content,
      cover_image_url: coverImageUrl || null,
      tags: tags,
      author: author.trim() || 'Team ICO',
      is_published: willPublish,
      published_at: willPublish ? (post?.published_at || new Date().toISOString()) : null,
    }

    try {
      if (isEdit) {
        await updatePost(id, payload)
      } else {
        const created = await createPost(payload)
        navigate(`/admin/blog/${created.id}/edit`, { replace: true })
      }
      setIsPublished(willPublish)
      setSavedState('saved')
      showSuccess(willPublish ? 'Artikel gepubliceerd!' : 'Concept opgeslagen', '')
      setTimeout(() => setSavedState(null), 3000)
    } catch (err) {
      console.error('Save failed:', err)
      setSavedState('error')
      showError(err?.message || 'Opslaan mislukt', 'Fout')
    } finally {
      setSaving(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/admin/blog"
          className="flex items-center gap-1.5 text-sm cursor-pointer transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Blog
        </Link>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Opslaan status */}
          {savedState === 'saved' && (
            <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-success)' }}>
              <CheckCircle2 className="w-4 h-4" />
              Opgeslagen
            </span>
          )}
          {savedState === 'error' && (
            <span className="text-sm" style={{ color: 'var(--color-error)' }}>
              Opslaan mislukt
            </span>
          )}

          {/* Status badge */}
          <Badge variant={isPublished ? 'success' : 'neutral'} size="sm">
            {isPublished ? 'Gepubliceerd' : 'Concept'}
          </Badge>

          {/* Draft opslaan */}
          <Button
            variant="ghost"
            size="sm"
            disabled={saving || !title.trim()}
            onClick={() => handleSave(false)}
            leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {isPublished ? 'Opslaan' : 'Opslaan als concept'}
          </Button>

          {/* Publiceren */}
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

        {/* Links — editor */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(196,130,111,0.2)',
          }}
        >
          {/* Titel input */}
          <div className="p-5 pb-4 border-b" style={{ borderColor: 'rgba(196,130,111,0.15)' }}>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel van het artikel..."
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
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                /blog/
              </span>
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

          {/* TipTap toolbar */}
          <div className="tiptap-editor">
            <EditorToolbar
              editor={editor}
              onImageUpload={handleImageInEditor}
            />
            {imageUploading && (
              <div
                className="flex items-center gap-2 px-4 py-2 text-xs"
                style={{ backgroundColor: 'rgba(196,130,111,0.06)', color: 'var(--color-text-muted)' }}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--color-primary)' }} />
                Afbeelding uploaden...
              </div>
            )}

            {/* Editor content */}
            <div className="px-5 py-4">
              <EditorContent
                editor={editor}
                className="min-h-[380px]"
              />
            </div>
          </div>
        </div>

        {/* Rechts — instellingen sidebar */}
        <div className="space-y-4">
          {/* Cover afbeelding */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.2)',
            }}
          >
            <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
          </div>

          {/* Excerpt */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.2)',
            }}
          >
            <Textarea
              label="Samenvatting (excerpt)"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Korte samenvatting die getoond wordt in de blog overzicht..."
              hint="Zichtbaar op de blog overzichtspagina"
            />
          </div>

          {/* Tags + Auteur */}
          <div
            className="rounded-xl p-4 space-y-4"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(196,130,111,0.2)',
            }}
          >
            <TagInput tags={tags} onChange={setTags} />

            <Input
              label="Auteur"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Team ICO"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
