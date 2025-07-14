import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistItems = ref([])
  const isWishlistOpen = ref(false)

  // Computed properties
  const wishlistCount = computed(() => {
    return wishlistItems.value.length
  })

  const isInWishlist = computed(() => {
    return (productId) => wishlistItems.value.some(item => item.id === productId)
  })

  // Methods
  const addToWishlist = (product) => {
    const existingItem = wishlistItems.value.find(item => item.id === product.id)
    
    if (!existingItem) {
      wishlistItems.value.push(product)
    }
  }

  const removeFromWishlist = (productId) => {
    const index = wishlistItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      wishlistItems.value.splice(index, 1)
    }
  }

  const toggleWishlist = (product) => {
    const existingItem = wishlistItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
      // Abre o sidebar de favoritos automaticamente ao adicionar
      openWishlist()
    }
  }

  const clearWishlist = () => {
    wishlistItems.value = []
  }

  const openWishlist = () => {
    isWishlistOpen.value = true
  }

  const closeWishlist = () => {
    isWishlistOpen.value = false
  }

  const toggleWishlistSidebar = () => {
    console.log('Toggle wishlist sidebar called, current state:', isWishlistOpen.value)
    isWishlistOpen.value = !isWishlistOpen.value
    console.log('New state:', isWishlistOpen.value)
  }

  const addAllToCart = () => {
    // Esta função será implementada no componente que usa a store
    // Ela precisa da store do carrinho para funcionar
    return wishlistItems.value
  }

  return {
    wishlistItems,
    isWishlistOpen,
    wishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    openWishlist,
    closeWishlist,
    toggleWishlistSidebar,
    addAllToCart
  }
}) 