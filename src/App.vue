<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  // 应用保存的主题设置
  settingsStore.applyTheme(settingsStore.theme)
})
</script>

<style lang="scss">
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
