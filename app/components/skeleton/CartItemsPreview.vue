<template>
    <div class="animate-pulse">
        <div v-for="n in 2" :key="n" class="flex justify-between items-start mb-2 pt-2 first:pt-0">

            <div class="flex items-start space-x-4 w-full">
                <!-- Image skeleton -->
                <div class="lg:w-18 lg:h-18 w-15 h-15 bg-gray-300 rounded"></div>

                <div class="flex-1">
                    <!-- Title skeleton -->
                    <div class="h-4 bg-gray-300 rounded w-28 lg:w-40 mb-2"></div>

                    <!-- Subscription badge skeleton -->
                    <div v-if="n === 1" class="h-4 bg-gray-300 w-32 rounded-lg"></div>
                </div>
            </div>

            <!-- Price skeleton -->
            <div class="flex flex-col items-end">
                <div class="flex gap-1.5 items-baseline">
                    <div class="h-4 bg-gray-300 rounded w-8"></div>
                    <div class="h-4 bg-gray-300 rounded w-10"></div>
                </div>
                <div v-if="n === 1" class="h-4 bg-gray-300 rounded w-14 mt-2"></div>
            </div>
        </div>
    </div>

</template>