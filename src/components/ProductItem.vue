<script>
import axios from 'axios';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';

export default {
  data() {
    return {
      allProducts: [],
      product: {},
      activeModal: false,
      loading: false
    }
  },
  setup() {
    const cartStore = useCartStore();
    const wishlistStore = useWishlistStore();
    return {
      cartStore,
      wishlistStore
    };
  },
  methods: {
    getAllProducts() {
      this.loading = true;
      axios.get(`https://fakestoreapi.com/products`)
        .then((res) => {
          this.allProducts = res.data
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        })
    },
    getProduct(id) {
      axios.get(`https://fakestoreapi.com/products/${id}`)
        .then((res) => {
          this.product = res.data
        })
        .catch((error) => {
          console.error(error);
        })
    },
    formatPrice(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    toggleModal() {
      this.activeModal = !this.activeModal;
    },
    closeModal() {
      this.activeModal = false;
    },
    addToCart(product) {
      this.cartStore.addToCart(product);
    },
    toggleWishlist(product) {
      this.wishlistStore.toggleWishlist(product);
    },
    isInWishlist(productId) {
      return this.wishlistStore.isInWishlist(productId);
    }
  },
  mounted() {
    this.getAllProducts();
  }
};
</script>

<template>
  <div class="products-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="ri-loader-4-line"></i>
        <p>Carregando produtos...</p>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div @click="toggleModal" :class="{ active: activeModal }" class="product-detail-overlay">
      <div class="product-detail">
        <button class="product-detail-close" @click.stop="closeModal">
          <i class="ri-close-line"></i>
        </button>
        <div class="product-detail-content">
          <figure>
            <img :src="product.image" :alt="product.title" />
          </figure>
          <div class="product-detail-content-infos">
            <h2 class="detail-name">{{ product.title }}</h2>
            <h4 class="detail-category">{{ product.category }}</h4>
            <h5 class="detail-description"><b>Description:</b><br> {{ product.description }}</h5>
            <h4 v-if="product && product.price" class="price">{{ formatPrice(product.price) }}</h4>
            <div class="detail-actions">
              <button @click="addToCart(product)" class="btn-buy">
                ADICIONAR AO CARRINHO<i class="ri-shopping-cart-2-line"></i>
              </button>
              <button @click="toggleWishlist(product)" class="btn-wishlist" :class="{ active: isInWishlist(product.id) }">
                <i :class="isInWishlist(product.id) ? 'ri-heart-fill' : 'ri-heart-line'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid">
      <div v-for="item in allProducts" :key="item.id" class="product-card">
        <div class="product-image-container">
          <img :src="item.image" :alt="item.title" class="product-image">
          <button @click="toggleWishlist(item)" class="wishlist-btn" :class="{ active: isInWishlist(item.id) }">
            <i :class="isInWishlist(item.id) ? 'ri-heart-fill' : 'ri-heart-line'"></i>
          </button>
          <button @click="getProduct(item.id), activeModal = !activeModal" class="view-btn">
            <i class="ri-eye-line"></i>
          </button>
        </div>
        
        <div class="product-info">
          <h3 class="product-title">{{ item.title }}</h3>
          <p class="product-category">{{ item.category }}</p>
          <div class="product-price">{{ formatPrice(item.price) }}</div>
        </div>
        
        <div class="product-actions">
          <button @click="addToCart(item)" class="add-to-cart-btn">
            <i class="ri-shopping-cart-line"></i>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.products-container {
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  .loading-spinner {
    text-align: center;
    color: var(--body-font-color);
    
    i {
      font-size: 48px;
      animation: spin 1s linear infinite;
      display: block;
      margin-bottom: 15px;
    }
    
    p {
      font-size: 16px;
      margin: 0;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  background: #f8f9fa;
  overflow: hidden;

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 20px;
    transition: transform 0.3s ease;
  }

  .wishlist-btn, .view-btn {
    position: absolute;
    top: 12px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: white;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.1);
    }

    i {
      font-size: 18px;
    }
  }

  .wishlist-btn {
    right: 12px;

    &:hover, &.active {
      background: #ff6b6b;
      color: white;
    }
  }

  .view-btn {
    right: 60px;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }
}

.product-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .product-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-category {
    font-size: 14px;
    color: #666;
    text-transform: capitalize;
    margin: 0;
  }

  .product-price {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
    margin-top: auto;
  }
}

.product-actions {
  padding: 0 20px 20px;

  .add-to-cart-btn {
    width: 100%;
    padding: 12px 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    i {
      font-size: 16px;
    }
  }
}

// Product Detail Modal
.product-detail-overlay {
  position: fixed;
  opacity: 0;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  transition: all .4s ease-in-out;

  &.active {
    opacity: 1;
    visibility: visible;
    z-index: 1000;
    transition: all .4s ease-in-out;
  }

  .product-detail {
    width: 85%;
    max-width: 900px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    position: relative;
    border-radius: 12px;

    @include desktop {
      width: 90%;
    }

    &-close {
      position: absolute;
      top: -15px;
      right: -15px;
      width: 40px;
      height: 40px;
      background: var(--white);
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
      width: 100%;

      figure {
        width: 100%;
        max-width: 400px;
        display: block;

        img {
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }
      }

      &-infos {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 15px;
        flex: 1;

        .detail-name {
          color: var(--body-font-color);
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
        }

        .detail-category {
          color: var(--primary-dark);
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 1.3;
          text-transform: capitalize;
          margin: 0;
          padding: 6px 12px;
          background: rgba(2, 159, 174, 0.1);
          border-radius: 20px;
        }

        .detail-description {
          color: var(--body-font-color);
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 1.6;
          margin: 0;
        }

        .price {
          color: var(--primary-color);
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 1.1;
          margin: 0;
        }
        
        .detail-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 10px;
          
          .btn-buy {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 24px;
            color: var(--white);
            border-radius: 8px;
            background: var(--primary-color);
            transition: all 0.3s ease-in-out;
            border: none;
            font-size: 16px;
            font-weight: 600;

            i {
              font-size: 20px;
            }

            &:hover {
              background: var(--primary-dark);
              transform: translateY(-1px);
            }
          }
          
          .btn-wishlist {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            color: #666;
            border-radius: 8px;
            background: #f5f5f5;
            transition: all 0.3s ease-in-out;
            border: none;

            i {
              font-size: 20px;
            }

            &:hover, &.active {
              background: #ff6b6b;
              color: white;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .products-container {
    padding: 15px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .product-detail {
    width: 95%;
    padding: 15px;
    flex-direction: column;
    max-height: 90vh;
    overflow-y: auto;

    &-content {
      flex-direction: column;
      gap: 20px;

      figure {
        max-width: 300px;
      }

      &-infos {
        .detail-name {
          font-size: 24px;
        }

        .detail-actions {
          flex-direction: column;
          width: 100%;

          .btn-buy {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>