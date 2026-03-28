import { create } from 'zustand'

// ===========================================
// ICO — UI State Store (Zustand)
// Mobile menu, cart drawer, toasts
// ===========================================

export const useUiStore = create((set, get) => ({
  // --- Mobile menu ---
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // --- Cart drawer ---
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // --- Toast notificaties ---
  toasts: [],

  addToast: ({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now().toString()
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message, duration }],
    }))

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  // Shortcut helpers voor toast types
  showSuccess: (message, title) => get().addToast({ type: 'success', title, message }),
  showError: (message, title) => get().addToast({ type: 'error', title, message }),
  showWarning: (message, title) => get().addToast({ type: 'warning', title, message }),
  showInfo: (message, title) => get().addToast({ type: 'info', title, message }),
}))
