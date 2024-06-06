<script setup>
import MainLayout from './layout/MainLayout.vue';
import { useRoute } from 'vue-router'
import { computed } from 'vue';

const layout = {'main': MainLayout }
const route =  useRoute()
const routeLayout =  computed( () =>  route.meta.layout) 


</script>

<template>
  <component :is="layout[routeLayout]" v-if="routeLayout"></component>
</template>