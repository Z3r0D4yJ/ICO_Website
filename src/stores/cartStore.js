import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

// ===========================================
// ICO — Winkelwagen Store (Zustand)
// Persistent via localStorage
// ===========================================

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Voeg product toe aan winkelwagen
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === product.id)

          if (existingIndex >= 0) {
            // Product bestaat al — verhoog aantal
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            }
            return { items: updatedItems }
          }

          // Nieuw product toevoegen
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity,
              },
            ],
          }
        })
      },

      // Verwijder product uit winkelwagen
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      // Wijzig aantal van een product
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      // Winkelwagen leegmaken
      clearCart: () => set({ items: [] }),

      // Bereken totalen
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      get shippingCost() {
        const subtotal = get().subtotal
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      get total() {
        return get().subtotal + get().shippingCost
      },

      get isEmpty() {
        return get().items.length === 0
      },
    }),
    {
      name: 'ico-cart',
      // Bewaar enkel de items in localStorage
      partialize: (state) => ({ items: state.items }),
    }
  )
)
