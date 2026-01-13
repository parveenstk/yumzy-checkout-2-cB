<script setup>
import { useFormStore } from '~~/stores';

const formStore = useFormStore();
const isVisible = computed(() => formStore.apiErrorAlert.status)

const hideAlert = () => {
    console.log("hideAlert triggered")
    formStore.apiErrorAlert.status = false
};

</script>

<template>
    <Transition name="fade-slide">
        <div v-if="isVisible" class="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-auto z-[70] flex gap-3 items-center p-3.5 mb-4 text-sm 
      text-red-800 border border-red-300 rounded-lg bg-red-50 shadow-lg" role="alert">
            <svg class="shrink-0 inline w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <div>
                <span class="font-medium">ERROR!</span>
                {{ formStore.apiErrorAlert.message }}
            </div>
            <NuxtImg @click="hideAlert" width="25" height="25" class="cursor-pointer" src="/images/alert-cross.svg"
                alt="alert-cross.svg-Img" />
        </div>
    </Transition>
</template>
