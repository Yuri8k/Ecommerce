<script setup>
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { watch } from 'vue'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const formatPrice = (value) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const addToCartFromWishlist = (product) => {
  cartStore.addToCart(product)
}

const removeFromWishlist = (productId) => {
  wishlistStore.removeFromWishlist(productId)
}

const addAllToCart = () => {
  wishlistStore.wishlistItems.forEach(product => {
    cartStore.addToCart(product)
  })
  // Opcional: limpar favoritos após adicionar todos ao carrinho
  // wishlistStore.clearWishlist()
}

// Debug: log quando o componente é montado
console.log('WishlistSidebar mounted, isWishlistOpen:', wishlistStore.isWishlistOpen)

// Watcher para monitorar mudanças
watch(() => wishlistStore.isWishlistOpen, (newValue) => {
  console.log('WishlistSidebar - isWishlistOpen changed to:', newValue)
})
</script>

<template>
  <div class="wishlist-sidebar-overlay" :class="{ active: wishlistStore.isWishlistOpen }" @click="wishlistStore.closeWishlist">
    <!-- Debug: {{ wishlistStore.isWishlistOpen }} -->
    <div class="wishlist-sidebar" @click.stop>
      <div class="wishlist-header">
        <h2>Meus Favoritos</h2>
        <button class="close-btn" @click="wishlistStore.closeWishlist">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="wishlist-content">
        <div v-if="wishlistStore.wishlistItems.length === 0" class="empty-wishlist">
          <i class="ri-heart-line"></i>
          <p>Sua lista de favoritos está vazia</p>
          <span>Adicione produtos aos favoritos para vê-los aqui</span>
        </div>

        <div v-else class="wishlist-items">
          <div v-for="item in wishlistStore.wishlistItems" :key="item.id" class="wishlist-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title">
            </div>
            
            <div class="item-details">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }}</p>
              
              <div class="item-actions">
                <button @click="addToCartFromWishlist(item)" class="add-to-cart-btn">
                  <i class="ri-shopping-cart-line"></i>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>

            <button @click="removeFromWishlist(item.id)" class="remove-btn">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="wishlistStore.wishlistItems.length > 0" class="wishlist-footer">
        <div class="wishlist-info">
          <span>{{ wishlistStore.wishlistCount }} produto(s) favoritado(s)</span>
        </div>
        
        <div class="wishlist-actions">
          <button @click="wishlistStore.clearWishlist" class="clear-btn">
            Limpar Favoritos
          </button>
          <button @click="addAllToCart" class="add-all-btn">
            Adicionar Todos ao Carrinho
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wishlist-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.wishlist-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease;

  .wishlist-sidebar-overlay.active & {
    right: 0;
  }
}

.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: white;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: white;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.wishlist-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-wishlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: #999;

  i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #ff6b6b;
  }

  p {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 500;
  }

  span {
    font-size: 14px;
  }
}

.wishlist-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.wishlist-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .item-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .item-title {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-price {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .item-actions {
      .add-to-cart-btn {
        width: 100%;
        padding: 8px 12px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        transition: all 0.2s ease;

        &:hover {
          background: #218838;
        }

        i {
          font-size: 14px;
        }
      }
    }
  }

  .remove-btn {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #fdf2f2;
    }

    i {
      font-size: 18px;
    }
  }
}

.wishlist-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  background: #fafafa;

  .wishlist-info {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;

    span {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  .wishlist-actions {
    display: flex;
    gap: 10px;

    button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &.clear-btn {
        background: #f8f9fa;
        color: #6c757d;
        border: 1px solid #dee2e6;

        &:hover {
          background: #e9ecef;
        }
      }

      &.add-all-btn {
        background: #ff6b6b;
        color: white;

        &:hover {
          background: #ff5252;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .wishlist-sidebar {
    max-width: 100%;
  }
}
</style> 