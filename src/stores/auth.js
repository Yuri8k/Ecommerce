import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // Computed properties
  const userInitials = computed(() => {
    if (!user.value) return ''
    const name = user.value.name || user.value.email
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  const displayName = computed(() => {
    if (!user.value) return ''
    return user.value.name || user.value.email
  })

  // Methods
  const login = async (credentials) => {
    isLoading.value = true
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock de resposta da API
      const mockUser = {
        id: 1,
        name: 'Usuário Teste',
        email: credentials.email,
        avatar: null
      }
      
      user.value = mockUser
      isAuthenticated.value = true
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Erro ao fazer login' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock de resposta da API
      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        avatar: null
      }
      
      user.value = mockUser
      isAuthenticated.value = true
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Erro ao fazer cadastro' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }

  // Inicializar verificação de autenticação
  checkAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
    userInitials,
    displayName,
    login,
    register,
    logout,
    checkAuth
  }
}) 