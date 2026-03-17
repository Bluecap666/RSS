import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 阅读设置
  const fontSize = ref(16) // 字体大小 (px)
  const lineHeight = ref(1.8) // 行高
  const theme = ref('light') // 主题：light, dark, sepia
  const autoRefresh = ref(true) // 自动刷新
  const refreshInterval = ref(30) // 刷新间隔 (分钟)

  // 设置字体大小
  const setFontSize = (size) => {
    fontSize.value = size
  }

  // 设置行高
  const setLineHeight = (height) => {
    lineHeight.value = height
  }

  // 设置主题
  const setTheme = (newTheme) => {
    theme.value = newTheme
    applyTheme(newTheme)
  }

  // 应用主题
  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName)
  }

  // 切换主题
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'sepia']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // 设置自动刷新
  const setAutoRefresh = (enabled) => {
    autoRefresh.value = enabled
  }

  // 设置刷新间隔
  const setRefreshInterval = (interval) => {
    refreshInterval.value = interval
  }

  // 重置所有设置
  const resetSettings = () => {
    fontSize.value = 16
    lineHeight.value = 1.8
    theme.value = 'light'
    autoRefresh.value = true
    refreshInterval.value = 30
  }

  return {
    fontSize,
    lineHeight,
    theme,
    autoRefresh,
    refreshInterval,
    setFontSize,
    setLineHeight,
    setTheme,
    toggleTheme,
    setAutoRefresh,
    setRefreshInterval,
    resetSettings
  }
})
