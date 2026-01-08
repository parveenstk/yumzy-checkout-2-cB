<script setup lang="ts">
// Props for error
defineProps({
    error: {
        type: Object,
        default: () => ({})
    }
})

const param = getFromStorage<"lp1" | "lp2" | "lp3">("lpParam", "session") || "lp1";

// Handle go back
const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else clearError({ redirect: `/${param}` })
}

</script>
<template>
    <div
        class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-400 flex items-center justify-center p-4">
        <div
            class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <!-- Header with fun illustration -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
                <div class="relative mx-auto w-24 h-24">
                    <!-- Simple CSS monster/character -->
                    <div class="absolute inset-0 bg-yellow-300 rounded-full"></div>
                    <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rounded-full"></div>
                    <div class="absolute top-2 right-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rounded-full">
                    </div>
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full">
                    </div>
                    <div
                        class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-400 rounded-full -rotate-45">
                    </div>
                </div>
                <h1 class="text-4xl font-bold text-white mt-4 mb-2">Oopsie!</h1>
                <p class="text-blue-100 text-lg">A little hiccup happened 🐒</p>
            </div>

            <!-- Error message -->
            <div class="p-8 text-center">
                <p class="text-gray-700 text-xl mb-4">Don't worry, even monkeys make mistakes sometimes!</p>
                <p v-if="error" class="text-sm text-gray-500 mb-6 italic">({{ error.statusCode }}: {{ error.message }})
                </p>

                <!-- Buttons -->
                <div class="space-y-3">
                    <button @click="goBack()"
                        class="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 cursor-pointer">
                        🏠 Go Back
                    </button>
                </div>
            </div>

            <!-- Footer fun fact -->
            <div class="bg-gray-50 p-4 text-center">
                <p class="text-sm text-gray-600">Fun fact: Bananas are berries, but strawberries aren't! 🍌</p>
            </div>
        </div>
    </div>
</template>
