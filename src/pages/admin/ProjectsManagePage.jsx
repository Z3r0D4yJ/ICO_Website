import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  Image,
  Calendar,
  Car,
} from '@/lib/icons'
import { useAdminProjects } from '@/hooks/useProjects'
import { deleteProject, toggleProjectPublish } from '@/api/projects'
import { SERVICE_CATEGORIES } from '@/lib/constants'

function serviceLabel(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label_nl ?? value
}
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-BE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ProjectsManagePage() {
  const { projects, setProjects, loading } = useAdminProjects()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const handleTogglePublish = async (project) => {
    setTogglingId(project.id)
    try {
      await toggleProjectPublish(project.id, !project.is_published)
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : null }
            : p
        )
      )
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget.id)
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.03em',
            }}
          >
            PROJECTEN
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projecten'}
          </p>
        </div>
        <Button
          as={Link}
          to="/admin/projecten/nieuw"
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nieuw project
        </Button>
      </div>

      {/* Projecten lijst */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(196,130,111,0.2)',
        }}
      >
        {loading ? (
          <div className="divide-y" style={{ borderColor: 'rgba(196,130,111,0.1)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton variant="rect" width="80px" height="54px" className="rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="line" width="60%" height="18px" />
                  <Skeleton variant="line" width="35%" height="14px" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Image className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <div>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Nog geen projecten</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Voeg uw eerste project toe.</p>
            </div>
            <Button as={Link} to="/admin/projecten/nieuw" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Nieuw project
            </Button>
          </div>
        ) : (
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(196,130,111,0.1)' }}
              >
                {/* Cover thumbnail */}
                <div
                  className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface-overlay)' }}
                >
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      aria-hidden="true"
                    />
                  ) : (
                    <Image className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium truncate"
                    style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}
                  >
                    {project.title_nl}
                  </p>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-0.5">
                    <Badge variant={project.is_published ? 'success' : 'neutral'} size="sm">
                      {project.is_published ? 'Gepubliceerd' : 'Concept'}
                    </Badge>
                    {project.vehicle_brand && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <Car className="w-3 h-3" aria-hidden="true" />
                        {project.vehicle_brand}
                      </span>
                    )}
                    {project.service_type && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {serviceLabel(project.service_type)}
                      </span>
                    )}
                    {project.published_at && project.is_published && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {formatDate(project.published_at)}
                      </span>
                    )}
                    {project.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: 'rgba(196,130,111,0.1)', color: 'var(--color-primary)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Acties */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Publiceer toggle */}
                  <button
                    onClick={() => handleTogglePublish(project)}
                    disabled={togglingId === project.id}
                    className="p-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40 disabled:opacity-50"
                    style={{ color: project.is_published ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                    aria-label={project.is_published ? 'Depubliceren' : 'Publiceren'}
                    title={project.is_published ? 'Depubliceren' : 'Publiceren'}
                  >
                    {project.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Bewerk */}
                  <Link
                    to={`/admin/projecten/${project.id}/edit`}
                    className="p-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label="Bewerk project"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  {/* Preview */}
                  {project.is_published && (
                    <Link
                      to={`/projecten/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                      style={{ color: 'var(--color-text-muted)' }}
                      aria-label="Bekijk op website"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  {/* Verwijder */}
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="p-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--color-surface-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,130,111,0.45)]/40"
                    style={{ color: 'var(--color-error)' }}
                    aria-label="Verwijder project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Verwijder bevestiging */}
      {deleteTarget && (
        <Modal
          isOpen
          onClose={() => setDeleteTarget(null)}
          title="Project verwijderen?"
          size="sm"
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Weet u zeker dat u <strong style={{ color: 'var(--color-text-primary)' }}>"{deleteTarget.title_nl}"</strong> wil verwijderen?
            Dit kan niet ongedaan worden.
          </p>
          <Modal.Footer>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Annuleren
            </Button>
            <Button variant="danger" size="sm" disabled={deleting} onClick={handleDelete}>
              {deleting ? 'Verwijderen...' : 'Definitief verwijderen'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}
