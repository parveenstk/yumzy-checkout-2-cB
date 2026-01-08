<template>
    <div
        class="offer-circle w-[100px] h-[100px] bg-[#c91f3f] rounded-full flex items-center justify-center relative text-white shrink-0">
        <div class="offer-text w-[84px] h-[84px] border-2 border-dashed border-white absolute rounded-full">
        </div>
        <div class="text-center">
            <p class="text-xs font-extralight">Up to</p>
            <p class="text-sm font-bold">60% OFF</p>
        </div>
    </div>
</template>

<style scoped>
.offer-circle .offer-text {
    -webkit-animation: rotateclc 12s linear infinite;
    animation: rotateclc 12s linear infinite;
}

@keyframes rotateclc {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
        /* anticlockwise */
    }
}

.arrowimg {
    /* -webkit-animation: leftdemote 0s infinite; */
    animation: leftdemote 3.5s infinite;
    top: 0px;
    left: -10px;
}

@keyframes leftdemote {
    0% {
        left: -35px;
    }

    25% {
        left: -8px;
    }

    50% {
        left: -35px;
    }

    75% {
        left: -8px;
    }

    100% {
        left: -35px;
    }
}
</style>