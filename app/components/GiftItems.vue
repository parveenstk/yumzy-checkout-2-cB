<script setup>
import { useCheckoutStore } from '~~/stores';

// Checkout Store
const checkoutStore = useCheckoutStore();

// Product price for "Subscribe & Save" tab
const productPrice = computed(() =>
    Number(checkoutStore.cartData[0]?.productPrice) || 0
)

// Product price for "One-time purchase" tabwhite-tick
const oneTimePrice = computed(() => {
    const bagQty = checkoutStore.cartData[0]?.BagsQty;
    const productPrice = checkoutStore.cartData[0]?.productPrice;

    if (!bagQty || !productPrice) return 0;
    return checkoutStore.calculateBagPrice(bagQty, productPrice);
});

// Config
const config = env();
const props = defineProps({
    customClass: {
        type: String,
        required: false,
        default: '',
    },
    selectedBag: {
        type: Number,
        required: true,
    },
    version: {
        type: String,
        default: 'first', // default is first if not passed
    },
});

// Utility: check if an item is dimmed
const isDimmed = (index) => {
    if (props.selectedBag === 1) return true;
    if (props.selectedBag === 2) return index > 2;
    return false;
};

// Now: filter based on version
const visibleItems = computed(() => {
    if (props.version === 'second') {
        const filteredGifts = checkoutStore.giftsProducts.filter((_, index) => !isDimmed(index));
        const filteredGiftIds = filteredGifts.map(pr => {
            if (config.giftItems.includes(pr.productId)) return pr.productId;
            else return;
        });
        checkoutStore.addGiftProducts(filteredGiftIds)
        // console.log("filteredGiftIds", filteredGiftIds)
        return filteredGifts;
    }
    return checkoutStore.giftsProducts;
});

</script>

<template>

    <div v-for="(item, index) in visibleItems" :key="index" :class="[
        'mt-2 mb-2 px-1 border border-dashed border-blue-500 rounded-lg overflow-hidden relative',
        customClass
    ]">
        <!-- Gradient overlay -->
        <div class="absolute inset-0 w-full h-full z-10 
      bg-[linear-gradient(144deg,rgba(255,235,0,0.27)_0%,rgba(30,185,240,0.2)_100%)]"
            :style="{ opacity: props.version === 'first' && isDimmed(index) ? '0.1' : '1' }"></div>

        <p :style="{ opacity: props.version === 'first' && isDimmed(index) ? '0.1' : '1' }"
            class="flex items-center justify-between py-1 px-0 lg:text-lg text-sm relative z-20 font-bold">
            <span class="flex items-center lg:gap-3 gap-2">
                <NuxtImg :src="item.productImage" :alt="item.productName"
                    class="lg:h-16 h-16 rounded-lg border border-dashed border-blue-500 p-1" />
                {{ item.productName }}
            </span>

            <span class="flex items-center gap-1 font-bold">
                <del v-if="index === 3" class="text-[#474747]">$500</del>
                <del v-else class="text-[#474747]">${{ item.compareAtPrice }}</del>
                <span>${{ item.productPrice }}</span>
            </span>

        </p>
    </div>

    <!-- Free Gift Value -->
    <div v-if="props.selectedBag !== 1" class="flex justify-between font-semibold">
        <p class="text-lg text-gray-900 [text-shadow:0.4px_0_0_currentColor] underline underline-offset-2">
            Free Gift Value Up to
        </p>
        <p class="text-gray-900">
            ${{
                checkoutStore.totalGiftProducts(checkoutStore.activeTab === 'subscribe' ? productPrice : oneTimePrice)
            }}
        </p>

    </div>

</template>