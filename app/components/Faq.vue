<template>
    <section class="max-w-[1200px] mx-auto py-5">
        <div class="w-full bg-white shadow rounded-lg lg:p-6 p-3 lg:pt-6 pt-6">
            <h2 class="text-center text-2xl extrablod text-gray-800 mb-6">
                FREQUENTLY ASKED QUESTIONS
            </h2>

            <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
                <button class="w-full text-left bg-gray-900 text-white px-4 py-3 font-semibold">
                    {{ faq.question }}
                </button>
                <p v-if="index === 3" v-html="faq.answer" class="px-4 py-4 text-gray-700 text-sm"></p>
                <p v-else class="px-4 py-4 text-gray-700 text-sm">
                    {{ faq.answer }}
                </p>
            </div>
        </div>
    </section>
</template>