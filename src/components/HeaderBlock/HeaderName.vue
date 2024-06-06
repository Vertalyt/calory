<template>
    <div class="flex items-center justify-between w-full px-3 gap-4">

            <RouterLink 
            v-if="!isHome"
            to="/">
                <SubmitCustom href="/" class="bg-cyan-800/70 hover:bg-cyan-700/70 px-4" :text="''">
                <HomeSVG class="w-8 h-8" />
                </SubmitCustom>
            </RouterLink>



        <RouterLink to="/" class="grow" >
        <h1 class="flex uppercase font-bold text-2xl sm:text-3xl italic font-mono text-center text-gray-100 py-2.5">{{ translate('balance') }}</h1>
        </RouterLink>
    <LangSelect class="grow-0"/>

    </div>

</template>

<script setup>
    import LangSelect from "@/components/HeaderBlock/LangSelect.vue";
    import { translate } from '@/lang'

    import SubmitCustom from "@/components/SubmitCustom.vue";
    import HomeSVG from "@/assets/SVG/HomeSVG.vue";
    import { useRoute } from 'vue-router'
    import { computed } from "vue";

    const route = useRoute()

    const isHome = computed( () => route.path === '/')
</script>

