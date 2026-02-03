<script setup lang="ts">
const props = defineProps({
    img: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    innerClass: {
        type: String,
        required: false,
    }
})
</script>

<template>
    <section class="w-full lg:py-5 lg:p-2 py-2 p-0">
        <div :class="[
            ' max-w-[1200px] flex rounded-md lg:px-4 px-2 py-2 lg:py-6 items-center justify-center text-sm sm:text-base text-gray-800 font-medium mx-2 lg:mx-auto',
            props.innerClass ?? 'bg-yellow-200 border border-yellow-300'
        ]">
            <NuxtImg v-if="props.img" :src="props.img" :alt="props.img"
                class="w-8 h-8 sm:w-8 sm:h-8 mr-2 flex-shrink-0" />

            <p class="text-center text-lg extrablod">
                {{ props.text }}
            </p>
        </div>
    </section>
</template>
