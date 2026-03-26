<template>
    <div class="relative mt-4 mb-6 animate-pulse">

        <!-- Desktop Skeleton -->
        <div
            class="hidden sm:block mx-auto sm:w-[90%] md:w-full max-w-[800px] h-[250px] md:h-[450px] bg-gray-300 rounded-xl">
        </div>

        <!-- Mobile Skeleton -->
        <div class="sm:hidden mx-auto w-[240px] max-w-[425px] h-[425px] bg-gray-300 rounded-xl "></div>

        <!-- Play Button Skeleton -->
        <div class="absolute inset-0 flex justify-center items-center">
            <div class="w-15 h-15 md:w-25 md:h-25 bg-gray-400 rounded-full"></div>
        </div>

    </div>
</template>