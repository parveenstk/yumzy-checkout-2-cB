<script setup lang="ts">
const props = defineProps<{
    icon: string
    title: string
    description: string
    bgColor: string
    borderColor: string
    textColor: string
}>()
</script>

<template>
    <div class="flex items-start space-x-3 w-full">

        <!-- Icon circle -->
        <div class="rounded-full min-w-10 min-h-10 flex items-center justify-center border-3"
            :class="[bgColor, borderColor]">
            <span class="text-white text-lg">
                {{ icon }}
            </span>
        </div>

        <!-- Text -->
        <p class="text-sm">
            <span class="font-black" :class="textColor">
                {{ title }}
            </span>

            <br />
            {{ description }}
        </p>
    </div>
</template>
