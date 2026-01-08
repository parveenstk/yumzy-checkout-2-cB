<template>
    <!-- Skeleton Loader -->
    <div v-for="n in 4" :key="n"
        class="mt-2 mb-2 px-1 border border-dashed border-blue-500 rounded-lg overflow-hidden relative animate-pulse bg-white">

        <!-- Simulated gradient overlay (for effect) -->
        <div
            class="absolute inset-0 w-full h-full z-10 bg-[linear-gradient(144deg,rgba(255,235,0,0.27)_0%,rgba(30,185,240,0.2)_100%)] opacity-30">
        </div>

        <!-- Skeleton content -->
        <div class="flex items-center justify-between py-1 px-2 relative z-20">
            <div class="flex items-center lg:gap-3 gap-2">
                <!-- Image Placeholder -->
                <div class="lg:h-16 h-16 w-16 rounded-lg border border-dashed border-blue-500 p-1 bg-gray-300"></div>

                <!-- Text Placeholder -->
                <div class="flex flex-col gap-2">
                    <div class="h-4 bg-gray-300 rounded w-32"></div>
                    <div class="h-3 bg-gray-300 rounded w-24"></div>
                </div>
            </div>

            <!-- Price Placeholder -->
            <div class="flex flex-col items-end gap-1">
                <div class="h-3 bg-gray-300 rounded w-12"></div>
                <div class="h-4 bg-gray-300 rounded w-16"></div>
            </div>
        </div>
    </div>

    <div class="flex justify-between items-baseline font-semibold animate-pulse px-1">
        <p class="rounded-sm h-5 w-30 bg-gray-300"></p>
        <p class="rounded-sm h-4 w-20 bg-gray-300"></p>
    </div>
</template>