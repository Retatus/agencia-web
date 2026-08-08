import { ref } from 'vue'

const STORAGE_KEY = 'erp-theme'
const isDark = ref(false)
let initialized = false

function applyTheme(value) {
  isDark.value = value
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
}

export function useTheme() {
  function initializeTheme() {
    if (initialized) return

    const storedTheme = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark)
    initialized = true
  }

  function toggleTheme() {
    applyTheme(!isDark.value)
  }

  return { isDark, initializeTheme, toggleTheme }
}

