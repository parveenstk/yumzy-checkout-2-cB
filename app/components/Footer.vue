<script setup lang="ts">
const lpParamValue = ref('/')

onMounted(() => {
    const param = getFromStorage('lpParam', 'session')

    if (!param || param === 'default') {
        lpParamValue.value = '/'
    } else {
        lpParamValue.value = `/${param}`
    }

    console.log('lpParam:', lpParamValue.value)
})

</script>

<template>
    <footer class="w-full text-gray-500 text-center text-sm py-6 px-4">

        <!-- Links -->
        <div class="mb-2">
            <template v-for="(item, index) in footerContent.links" :key="index">

                <NuxtLink :to="lpParamValue" class="hover:text-gray-800 hover:underline cursor-pointer">
                    {{ item.label }}
                </NuxtLink>

                <span v-if="index < footerContent.links.length - 1"> | </span>
            </template>
        </div>

        <!-- Disclaimer -->
        <p class="max-w-2xl mx-auto text-xs leading-relaxed whitespace-pre-line">
            {{ footerContent.disclaimer }}
        </p>

        <!-- DMCA Badge -->
        <div class="flex justify-center mt-3">
            <NuxtImg :src="footerContent.dmca.src" :alt="footerContent.dmca.alt" :height="footerContent.dmca.height"
                class="h-6" />
        </div>

    </footer>
</template>