<!-- <template>
    <footer class="w-full text-gray-500 text-center text-sm py-6 px-4">
        Links
        <div class="space-x-2 mb-2">
            <a href="#" class="hover:text-gray-700">Terms & Conditions</a> |
            <a href="#" class="hover:text-gray-700">Privacy Policy / CCPA</a> |
            <a href="#" class="hover:text-gray-700">Returns</a> |
        </div>

        Disclaimer
        <p class="max-w-2xl mx-auto text-xs leading-relaxed">
            By filling out the field, you consent for Yumzy to use automated technology, including texts and prerecorded
            messages, to contact you at the number and email provided about Yumzy offers.
        </p>

        DMCA Badge
        <div class="flex justify-center mt-3">
            <NuxtImg src="/images/dmca.png" alt="DMCA Protection" class="h-6" />
        </div>

    </footer>
</template> -->

<template>
    <footer class="w-full text-gray-500 text-center text-sm py-6 px-4">

        <!-- Links -->
        <div class="mb-2">
            <template v-for="(item, index) in footerContent.links" :key="index">
                <button class="hover:text-gray-800 hover:underline cursor-pointer">
                    {{ item.label }}
                </button>
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
