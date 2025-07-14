<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthModalOpen = ref(false)
const isLoginMode = ref(true)
const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toggleAuthModal = () => {
  isAuthModalOpen.value = !isAuthModalOpen.value
  errorMessage.value = ''
}

const switchToLogin = () => {
  isLoginMode.value = true
  errorMessage.value = ''
  // Limpar formulário de registro
  registerForm.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}

const switchToRegister = () => {
  isLoginMode.value = false
  errorMessage.value = ''
  // Limpar formulário de login
  loginForm.value = {
    email: '',
    password: ''
  }
}

const handleLogin = async () => {
  try {
    const result = await authStore.login(loginForm.value)
    if (result.success) {
      isAuthModalOpen.value = false
      // Limpar formulário
      loginForm.value = { email: '', password: '' }
    } else {
      errorMessage.value = result.error || 'Erro ao fazer login'
    }
  } catch (error) {
    errorMessage.value = 'Erro inesperado ao fazer login'
  }
}

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'As senhas não coincidem!'
    return
  }
  
  try {
    const result = await authStore.register(registerForm.value)
    if (result.success) {
      isAuthModalOpen.value = false
      // Limpar formulário
      registerForm.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    } else {
      errorMessage.value = result.error || 'Erro ao fazer cadastro'
    }
  } catch (error) {
    errorMessage.value = 'Erro inesperado ao fazer cadastro'
  }
}

// Expor a função para outros componentes
defineExpose({
  toggleAuthModal
})
</script>

<template>
  <div class="auth-modal-overlay" :class="{ active: isAuthModalOpen }" @click="toggleAuthModal">
    <div class="auth-modal" @click.stop>
      <div class="auth-modal-header">
        <h2>{{ isLoginMode ? 'Entrar' : 'Cadastrar' }}</h2>
        <button class="close-btn" @click="toggleAuthModal">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="auth-modal-content">
        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <i class="ri-error-warning-line"></i>
          {{ errorMessage }}
        </div>

        <!-- Login Form -->
        <form v-if="isLoginMode" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-email">E-mail</label>
            <input 
              id="login-email"
              v-model="loginForm.email"
              type="email" 
              placeholder="Seu e-mail"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <div class="form-group">
            <label for="login-password">Senha</label>
            <input 
              id="login-password"
              v-model="loginForm.password"
              type="password" 
              placeholder="Sua senha"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <button type="submit" class="submit-btn" :disabled="authStore.isLoading">
            <i v-if="authStore.isLoading" class="ri-loader-4-line"></i>
            <i v-else class="ri-login-box-line"></i>
            {{ authStore.isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
          
          <div class="form-footer">
            <span>Não tem uma conta?</span>
            <button type="button" @click="switchToRegister" class="switch-btn" :disabled="authStore.isLoading">
              Cadastre-se
            </button>
          </div>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="register-name">Nome completo</label>
            <input 
              id="register-name"
              v-model="registerForm.name"
              type="text" 
              placeholder="Seu nome completo"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <div class="form-group">
            <label for="register-email">E-mail</label>
            <input 
              id="register-email"
              v-model="registerForm.email"
              type="email" 
              placeholder="Seu e-mail"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <div class="form-group">
            <label for="register-password">Senha</label>
            <input 
              id="register-password"
              v-model="registerForm.password"
              type="password" 
              placeholder="Sua senha"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <div class="form-group">
            <label for="register-confirm-password">Confirmar senha</label>
            <input 
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password" 
              placeholder="Confirme sua senha"
              required
              :disabled="authStore.isLoading"
            >
          </div>
          
          <button type="submit" class="submit-btn" :disabled="authStore.isLoading">
            <i v-if="authStore.isLoading" class="ri-loader-4-line"></i>
            <i v-else class="ri-user-add-line"></i>
            {{ authStore.isLoading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
          
          <div class="form-footer">
            <span>Já tem uma conta?</span>
            <button type="button" @click="switchToLogin" class="switch-btn" :disabled="authStore.isLoading">
              Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.auth-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform: scale(0.9);
  transition: transform 0.3s ease;

  .auth-modal-overlay.active & {
    transform: scale(1);
  }
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));

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

.auth-modal-content {
  padding: 20px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  i {
    font-size: 16px;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(2, 159, 174, 0.1);
      }

      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }

      &::placeholder {
        color: #999;
      }
    }
  }

  .submit-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    i {
      font-size: 18px;
      
      &.ri-loader-4-line {
        animation: spin 1s linear infinite;
      }
    }
  }

  .form-footer {
    text-align: center;
    padding-top: 10px;
    border-top: 1px solid #eee;

    span {
      font-size: 14px;
      color: #666;
    }

    .switch-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-left: 5px;
      text-decoration: underline;

      &:hover:not(:disabled) {
        color: var(--primary-dark);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .auth-modal {
    width: 95%;
    margin: 20px;
  }
}
</style> 