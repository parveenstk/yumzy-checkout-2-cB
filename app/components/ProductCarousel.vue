<script setup lang="ts">

const props = defineProps<{
    slides: string[]
}>()

const activeSlide = ref(0)
const currentSlide = computed(() => props.slides[activeSlide.value])

const next = () => {
    activeSlide.value = (activeSlide.value + 1) % props.slides.length
}

const prev = () => {
    activeSlide.value =
        (activeSlide.value - 1 + props.slides.length) % props.slides.length
}

const goTo = (index: number) => {
    activeSlide.value = index
}
</script>

<template>
    <div class="w-full max-w-4xl space-y-4">

        <!-- Main Image -->
        <div class="relative overflow-hidden rounded-xl shadow-lg">
            <NuxtImg :src="currentSlide" width="509" alt="Carousel Image"
                class="w-full object-cover transition duration-500 md:max-h-[477px]" />

            <!-- Prev -->
            <button @click="prev"
                class="absolute text-4xl w-15 h-15 top-1/2 left-3 -translate-y-1/2 p-2 rounded-full shadow">
                &#10094;
            </button>

            <!-- Next -->
            <button @click="next"
                class="absolute text-4xl w-15 h-15 top-1/2 right-3 -translate-y-1/2 p-2 rounded-full shadow">
                &#10095;
            </button>
        </div>

        <!-- Thumbnails -->
        <div class="flex justify-center space-x-2">
            <div v-for="(slide, index) in slides" :key="index">
                <NuxtImg width="72" height="72" :src="slide" @click="goTo(index)" :class="activeSlide === index
                    ? 'ring-2 ring-blue-500 opacity-100'
                    : 'opacity-60 hover:opacity-100'"
                    class="w-12 h-12 lg:w-20 lg:h-20 object-cover rounded cursor-pointer transition p-1 overflow-hidden"
                    alt="carousel-thumbails" />
            </div>
        </div>

    </div>
</template>
