<script setup>
import Profile from './Profile.vue';
import Category from './Category.vue';
import AuthModal from './AuthModal.vue';
import SearchBar from './SearchBar.vue';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const authModalRef = ref(null);
const searchBarRef = ref(null);

const toggleWishlist = () => {
  console.log('Toggle wishlist clicked');
  wishlistStore.toggleWishlistSidebar();
};

const toggleCart = () => {
  console.log('Toggle cart clicked');
  cartStore.toggleCart();
};

const openAuthModal = () => {
  console.log('Open auth modal clicked');
  authModalRef.value?.toggleAuthModal();
};

const handleLogout = () => {
  authStore.logout();
};

const toggleMobileSearch = () => {
  searchBarRef.value?.toggleSearch();
};
</script>

<template>
    <header>
        <!-- Left Section - Icons -->
        <div class="header-left">
            <button @click="toggleWishlist" class="wishlist-btn">
                <i class="ri-heart-line"></i>
                <span v-if="wishlistStore.wishlistCount > 0" class="wishlist-count">{{ wishlistStore.wishlistCount }}</span>
            </button>
            <button @click="toggleCart" class="cart-btn">
                <i class="ri-shopping-cart-line"></i>
                <span v-if="cartStore.cartCount > 0" class="cart-count">{{ cartStore.cartCount }}</span>
            </button>
            
            <!-- Profile Button - Show different states based on authentication -->
            <div v-if="authStore.isAuthenticated" class="profile-dropdown">
                <button class="profile-btn authenticated">
                    <div class="user-avatar">
                        {{ authStore.userInitials }}
                    </div>
                </button>
                <div class="profile-dropdown-menu">
                    <div class="user-info">
                        <span class="user-name">{{ authStore.displayName }}</span>
                        <span class="user-email">{{ authStore.user.email }}</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button @click="handleLogout" class="dropdown-item">
                        <i class="ri-logout-box-line"></i>
                        Sair
                    </button>
                </div>
            </div>
            
            <button v-else @click="openAuthModal" class="profile-btn">
                <i class="ri-user-line"></i>
            </button>
        </div>

        <!-- Center Section - Search -->
        <div class="header-center">
            <SearchBar ref="searchBarRef" />
        </div>

        <!-- Right Section - Logo and Mobile Search -->
        <div class="header-right">
            <h1 class="logo">Yuri <b>Dev</b></h1>
            <!-- Mobile Search Toggle -->
            <button @click="toggleMobileSearch" class="mobile-search-toggle">
                <i class="ri-search-line"></i>
            </button>
        </div>
        
        <Category />
        
        <!-- Auth Modal -->
        <AuthModal ref="authModalRef" />
    </header>
</template>

<style lang="scss">
    header {
        background: var(--header);
        padding: 10px 16px;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 15px;
        
        @include desktop {
            padding: 20px 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
            justify-self: start;

            @include desktop {
                order: 1;
                flex-shrink: 0;
            }
        }

        .header-center {
            display: none;
            
            @include desktop {
                display: block;
                order: 2;
                flex: 1;
                max-width: 500px;
                margin: 0 auto;
            }
        }

        .header-right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            @include desktop {
                order: 3;
                flex-shrink: 0;
                justify-content: center;
            }

            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--body-font-color);
                font-size: 22px;
                font-style: normal;
                font-weight: 500;
                line-height: initial; 
                margin: 0;
                
                b {
                    color: var(--primary-color);
                    line-height: initial; 
                }
                
                @include desktop {
                    font-size: 26px;
                }
            }

            .mobile-search-toggle {
                display: block;
                background: none;
                border: none;
                font-size: 24px;
                color: var(--body-font-color);
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(0, 0, 0, 0.1);
                    color: var(--primary-color);
                }

                @include desktop {
                    display: none;
                }
            }
        }

        .wishlist-btn, .cart-btn, .profile-btn {
            position: relative;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--body-font-color);
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(0, 0, 0, 0.1);
            }
        }

        .wishlist-btn {
            &:hover {
                color: #ff6b6b;
            }

            .wishlist-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff6b6b;
                color: white;
                font-size: 12px;
                font-weight: 600;
                min-width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2px;
            }
        }

        .cart-btn {
            &:hover {
                color: var(--primary-color);
            }

            .cart-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--primary-color);
                color: white;
                font-size: 12px;
                font-weight: 600;
                min-width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2px;
            }
        }

        .profile-btn {
            &:hover {
                color: var(--primary-color);
            }

            &.authenticated {
                .user-avatar {
                    width: 32px;
                    height: 32px;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 600;
                }
            }
        }

        .profile-dropdown {
            position: relative;

            &:hover .profile-dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .profile-dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;

                .user-info {
                    padding: 15px;
                    border-bottom: 1px solid #eee;

                    .user-name {
                        display: block;
                        font-weight: 600;
                        color: #333;
                        font-size: 14px;
                    }

                    .user-email {
                        display: block;
                        color: #666;
                        font-size: 12px;
                        margin-top: 2px;
                    }
                }

                .dropdown-divider {
                    height: 1px;
                    background: #eee;
                    margin: 5px 0;
                }

                .dropdown-item {
                    width: 100%;
                    padding: 12px 15px;
                    background: none;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                    font-size: 14px;
                    transition: background 0.2s ease;

                    &:hover {
                        background: #f5f5f5;
                    }

                    i {
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>
