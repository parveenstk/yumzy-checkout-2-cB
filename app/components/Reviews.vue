<template>
    <div name="reviews-section">
        <h2
            class="text-3xl lg:text-2xl font-bold border-b text-centerc border-[#e7e7e7] lg:pb-4 pb-2 pt-4 mb-3 text-center">
            <span class="block md:inline">Moms Like You</span>
            <span class="block md:inline"> Already Trust Yumzy</span>
        </h2>

        <article v-for="(review, index) in reviewsData" :key="index"
            :class="[`py-5 px-3 border-[#e7e7e7]`, index === 2 ? '' : 'border-b']">
            <div class="flex items-center gap-4">
                <NuxtImg :src="review.img" alt="review-img" class="w-12 h-12 rounded-full object-cover" />
                <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                        <h3 class="font-semibold text-gray-900 truncate">{{ review.name }}</h3>
                        <span class="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                            Verified Buyer
                        </span>
                    </div>
                    <div class="mt-1 flex items-center gap-2">
                        <div class="flex items-center">
                            <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.452 2.684c-.785.57-1.84-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.56 9.387c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.96z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-1">
                <h4 class="font-semibold text-gray-800">{{ review.title }}</h4>
                <p class="mt-2 mb-2 leading-[1.2] text-700 text-[#6b6d76] text-sm">{{ review.text }}</p>
                <time class="text-[#90949c] text-xs text-400 ml-auto">{{ review.date }}</time>
            </div>
        </article>
    </div>
</template>