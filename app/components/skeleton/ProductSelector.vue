<template>
    <!-- Loading Skeleton for Gummy Selectors -->
    <div class="flex flex-col sm:flex-row gap-6 space-y-4 sm:space-y-0 sm:space-x-2 lg:space-x-6 mb-8 animate-pulse">

        <!-- Repeat this skeleton 2 times -->
        <div class="flex items-center gap-2 relative select-none" v-for="n in 2" :key="n">

            <!-- Circle (checkbox placeholder) -->
            <div class="w-6 h-6 border-2 shrink-0 rounded-full ml-3 border-[#172969] bg-gray-300"></div>

            <!-- Image placeholder -->
            <div class="w-14 h-14 rounded bg-gray-300"></div>

            <!-- Text placeholder -->
            <div class="h-4 bg-gray-300 rounded w-26"></div>
        </div>
    </div>
</template>