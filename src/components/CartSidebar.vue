<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const formatPrice = (value) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const handleQuantityChange = (item, newQuantity) => {
  cartStore.updateQuantity(item.id, newQuantity)
}

const incrementQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decrementQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity - 1)
}
</script>

<template>
  <div class="cart-sidebar-overlay" :class="{ active: cartStore.isCartOpen }" @click="cartStore.closeCart">
    <div class="cart-sidebar" @click.stop>
      <div class="cart-header">
        <h2>Carrinho de Compras</h2>
        <button class="close-btn" @click="cartStore.closeCart">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="cart-content">
        <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
          <i class="ri-shopping-cart-line"></i>
          <p>Seu carrinho está vazio</p>
          <span>Adicione produtos para começar</span>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title">
            </div>
            
            <div class="item-details">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }}</p>
              
              <div class="quantity-controls">
                <button @click="decrementQuantity(item)" class="qty-btn">
                  <i class="ri-subtract-line"></i>
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="incrementQuantity(item)" class="qty-btn">
                  <i class="ri-add-line"></i>
                </button>
              </div>
            </div>

            <button @click="cartStore.removeFromCart(item.id)" class="remove-btn">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="cartStore.cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <strong>{{ formatPrice(cartStore.cartTotal) }}</strong>
        </div>
        
        <div class="cart-actions">
          <button @click="cartStore.clearCart" class="clear-btn">
            Limpar Carrinho
          </button>
          <button class="checkout-btn">
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-sidebar-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.cart-sidebar {
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

  .cart-sidebar-overlay.active & {
    right: 0;
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  }
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
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

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;

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

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;

      .qty-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
          background: #f5f5f5;
        }

        i {
          font-size: 16px;
        }
      }

      .quantity {
        font-weight: 500;
        min-width: 20px;
        text-align: center;
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

.cart-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  background: #fafafa;

  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;

    span {
      font-size: 16px;
      color: #666;
    }

    strong {
      font-size: 20px;
      color: #2c3e50;
    }
  }

  .cart-actions {
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

      &.checkout-btn {
        background: #28a745;
        color: white;

        &:hover {
          background: #218838;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style> 