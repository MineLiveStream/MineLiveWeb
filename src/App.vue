<template>
  <div id="app">
      <mdui-linear-progress v-if="loading" indeterminate class="fixed top-0 left-0 w-full z-50" />
      <router-view />
  </div>
</template>
<script setup>
    import { ref } from 'vue'
    const loading = ref(false)
</script>