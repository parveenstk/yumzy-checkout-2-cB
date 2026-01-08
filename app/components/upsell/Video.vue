<script>
export default {
    props: {
        src: { type: String, default: '/images/upsellvideo.mp4' },
        poster: { type: String, default: '/images/upsellthumb.png' }
    },
    data() {
        return {
            overlaySrc: '/images/play-button.png',
            hideOverlay: false,
            hideTimeout: null
        };
    },
    mounted() {
        const video = this.$refs.video;
        // make sure video element exists
        if (!video) {
            console.error('myVideo element not found');
            return;
        }
        video.addEventListener('play', this.onPlay);
        video.addEventListener('pause', this.onPause);
        video.addEventListener('ended', this.onEnded);

        // small debug log so you can see clicks in console
        console.log('Video mounted. src=', this.src);
    },
    beforeUnmount() {
        const v = this.$refs.video;
        if (v) {
            v.removeEventListener('play', this.onPlay);
            v.removeEventListener('pause', this.onPause);
            v.removeEventListener('ended', this.onEnded);
        }
        this.clearHideTimeout();
    },
    methods: {
        togglePlay() {
            const video = this.$refs.video;
            if (!video) return;
            console.log('togglePlay called (video.paused =', video.paused, ')');

            if (video.paused) {
                // attempt to play (returns a promise on modern browsers)
                video.play().then(() => {
                    // show native controls while playing
                    video.setAttribute('controls', '');
                }).catch(err => {
                    console.warn('video.play() failed:', err);
                });
            } else {
                video.pause();
                // optional: remove native controls when paused to avoid overlap
                video.removeAttribute('controls');
            }
        },
        onPlay() {
            this.overlaySrc = '/images/pause.png';
            this.startHideTimeout(); // auto-hide icon after short delay
        },
        onPause() {
            this.overlaySrc = '/images/play-button.png';
            this.showOverlay();
            // remove native controls when paused
            this.$refs.video.removeAttribute('controls');
        },
        onEnded() {
            this.overlaySrc = '/images/play-button.png';
            this.$refs.video.removeAttribute('controls');
            this.$refs.video.currentTime = 0;
            this.showOverlay();
        },
        startHideTimeout() {
            this.clearHideTimeout();
            this.hideOverlay = false;
            this.hideTimeout = setTimeout(() => {
                this.hideOverlay = true;
            }, 1500); // hide after 1.5s
        },
        clearHideTimeout() {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
        },
        showOverlay() {
            this.clearHideTimeout();
            this.hideOverlay = false;
        },
        onMouseMove() {
            // when user moves mouse while playing, show icon briefly
            const v = this.$refs.video;
            if (v && !v.paused) {
                this.showOverlay();
                this.startHideTimeout();
            }
        }
    }
};
</script>
<template>
    <!-- video -->
    <div class="flex justify-center items-center w-full max-w-5xl mx-auto p-4 ">
        <div ref="wrapper" id="videoWrapper" class="w-full relative cursor-pointer" tabindex="0" @click="togglePlay"
            @keydown.space.prevent="togglePlay" @mousemove="onMouseMove">
            <video ref="video" id="myVideo" class="w-full rounded-lg shadow-lg block" playsinline :poster="poster"
                preload="metadata" style="aspect-ratio:16/9;">
                <source :src="src" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <!-- overlay icon (pointer-events: none so it doesn't block clicks) -->
            <NuxtImg :src="overlaySrc" id="overlayIcon"
                class="absolute inset-0 m-auto w-16 h-16 select-none pointer-events-none z-10 transition-opacity duration-300"
                :class="{ 'opacity-0': hideOverlay }" alt="Play / Pause" />
        </div>
    </div>
</template>