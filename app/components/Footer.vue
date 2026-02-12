<template>
    <footer class="w-full text-gray-500 text-center text-sm py-6 px-4">

        <!-- Links -->
        <div class="mb-2">
            <template v-for="(item, index) in footerContent.links" :key="index">

                <!-- Internal Link -->
                <NuxtLink v-if="item.url.startsWith('/')" :to="item.url"
                    class="hover:text-gray-800 hover:underline cursor-pointer">
                    {{ item.label }}
                </NuxtLink>

                <!-- External Link -->
                <a v-else :href="item.url" target="_blank" rel="noopener noreferrer"
                    class="hover:text-gray-800 hover:underline cursor-pointer">
                    {{ item.label }}
                </a>

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
