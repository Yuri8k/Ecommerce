<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const isSearchOpen = ref(false)

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    // Focus no campo de busca quando abrir
    setTimeout(() => {
      document.getElementById('search-input')?.focus()
    }, 100)
  }
}

const handleSearch = (event) => {
  event.preventDefault()
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Aqui você implementaria a lógica de busca
    // Por enquanto apenas simula
    alert(`Buscando por: ${searchQuery.value}`)
  }
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

// Expor funções para outros componentes
defineExpose({
  toggleSearch,
  closeSearch
})
</script>

<template>
  <div class="search-container">
    <!-- Desktop Search Bar -->
    <div class="desktop-search">
      <form @submit="handleSearch" class="search-form">
        <div class="search-input-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="search-input"
          >
          <button type="submit" class="search-btn">
            <i class="ri-search-line"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- Mobile Search Toggle -->
    <button @click="toggleSearch" class="mobile-search-toggle">
      <i class="ri-search-line"></i>
    </button>

    <!-- Mobile Search Modal -->
    <div v-if="isSearchOpen" class="mobile-search-overlay" @click="closeSearch">
      <div class="mobile-search-modal" @click.stop>
        <div class="mobile-search-header">
          <h3>Buscar produtos</h3>
          <button @click="closeSearch" class="close-search-btn">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <form @submit="handleSearch" class="mobile-search-form">
          <div class="search-input-group">
            <input
              id="search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Digite o que você procura..."
              class="search-input"
            >
            <button type="submit" class="search-btn">
              <i class="ri-search-line"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  position: relative;
}

.desktop-search {
  display: none;
  
  @include desktop {
    display: block;
    width: 100%;
    max-width: 500px;
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

.search-form {
  width: 100%;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(2, 159, 174, 0.1);
  }
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;

  &::placeholder {
    color: #999;
  }
}

.search-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }

  i {
    font-size: 18px;
  }
}

// Mobile Search Modal
.mobile-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;

  @include desktop {
    display: none;
  }
}

.mobile-search-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease;
}

.mobile-search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
  }

  .close-search-btn {
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

.mobile-search-form {
  padding: 20px;

  .search-input-group {
    margin-bottom: 15px;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 