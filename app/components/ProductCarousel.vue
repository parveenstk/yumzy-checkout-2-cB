<script setup lang="ts">

const props = defineProps<{
    slides: string[]
}>()

const activeSlide = ref(0)

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
        <div class="relative overflow-hidden rounded-xl shadow-lg md:max-h-[477px]">
            <div class="flex transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
                :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
                <NuxtImg v-for="(slide, index) in slides" :key="index" :src="slide" width="1000" height="904"
                    class="w-full flex-shrink-0 object-cover" alt="Carousel Image" />
            </div>

            <!-- Prev -->
            <button @click="prev"
                class="absolute text-4xl w-15 h-15 top-1/2 left-3 -translate-y-1/2 p-2 rounded-full cursor-pointer shadow hover:shadow-2xl hover:bg-white/50 transition-all duration-500">
                &#10094;
            </button>

            <!-- Next -->
            <button @click="next"
                class="absolute text-4xl w-15 h-15 top-1/2 right-3 -translate-y-1/2 p-2 rounded-full cursor-pointer shadow hover:shadow-2xl hover:bg-white/50 transition-all duration-500">
                &#10095;
            </button>
        </div>

        <!-- Thumbnails -->
        <div class="flex justify-center space-x-2">
            <div v-for="(slide, index) in slides" :key="index">
                <NuxtImg width="72" height="72" :src="slide" @click="goTo(index)" :class="activeSlide === index
                    ? 'ring-2 ring-blue-500 opacity-100'
                    : 'opacity-60 hover:opacity-100'"
                    class="w-12 h-10 lg:w-20 lg:h-16 object-cover rounded cursor-pointer transition p-1 overflow-hidden"
                    alt="carousel-thumbails" />
            </div>
        </div>

    </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>