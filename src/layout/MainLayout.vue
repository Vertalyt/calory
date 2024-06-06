<script setup>
import HeaderName from "@/components/HeaderBlock/HeaderName.vue";

</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <header
      class="flex flex-col py-2 sm:flex-row flex-wrap items-center justify-around bg-cyan-900/70"
    >
      <HeaderName />
    </header>

    <main class="w-full h-screen overflow-y-auto bg-green-100/60 relative">
      <RouterView />
    </main>
  </div>
</template>
