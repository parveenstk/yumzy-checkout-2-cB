<script setup lang="ts">
const props = defineProps({
    desktopUrl: {
        type: String,
        required: true
    },
    mobileUrl: {
        type: String,
        required: true
    },
    thumbnailDesktop: {
        type: String,
        required: false
    },
    thumbnailMobile: {
        type: String,
        required: false
    }
})

// desktop
const desktopRef = ref<HTMLVideoElement | null>(null)
const desktopPlaying = ref(false)

const toggleVideo = () => {
    const v = desktopRef.value
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
}

// mobile
const mobileRef = ref<HTMLVideoElement | null>(null)
const mobilePlaying = ref(false)

const toggleVideo2 = () => {
    const v = mobileRef.value
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
}

// attach event listeners
onMounted(() => {
    // desktop events
    if (desktopRef.value) {
        desktopRef.value.onplay = () => (desktopPlaying.value = true)
        desktopRef.value.onpause = () => (desktopPlaying.value = false)
    }

    // mobile events
    if (mobileRef.value) {
        mobileRef.value.onplay = () => (mobilePlaying.value = true)
        mobileRef.value.onpause = () => (mobilePlaying.value = false)
    }
})
</script>

<template>
    <div class="relative mt-4 mb-6">

        <!-- desktop view -->
        <video ref="desktopRef" playsinline :poster="props.thumbnailDesktop"
            class="hidden sm:block mx-auto sm:w-[90%] md:w-full max-w-[800px] object-contain cursor-pointer rounded-xl"
            @click="toggleVideo">
            <source :src="props.desktopUrl" type="video/mp4" />
        </video>

        <!-- Play button Desktop -->
        <div class="absolute top-0 bottom-0 w-full flex justify-center items-center cursor-pointer select-none"
            v-if="!desktopPlaying" @click="toggleVideo">
            <NuxtImg class="max-w-20 sm:max-w-30 mx-auto" src="/images/play.png" alt="Play button" />
        </div>

        <!-- mobile view -->
        <div class="relative mt-4 mb-6">
            <video ref="mobileRef" playsinline :poster="props.thumbnailMobile"
                class="sm:hidden block mx-auto max-h-[425px] object-contain cursor-pointer rounded-xl"
                @click="toggleVideo2" aria-label="Video showing expedited shipping offer">
                <source :src="props.mobileUrl" type="video/mp4" />
            </video>

            <!-- Play button Mobile -->
            <div class="sm:hidden absolute top-0 bottom-0 w-full flex justify-center items-center cursor-pointer select-none"
                v-if="!mobilePlaying" @click="toggleVideo2">
                <NuxtImg class="max-w-20 sm:max-w-30 mx-auto" src="/images/play.png" alt="Play button" />
            </div>
        </div>

    </div>
</template>