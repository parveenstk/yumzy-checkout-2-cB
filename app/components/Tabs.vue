<script setup lang="ts">
import { useCheckoutStore, useFormStore } from '~~/stores';

// checkout Store
const checkoutStore = useCheckoutStore();
const formStore = useFormStore();
const config = env();

// Update active tab and re-calculated cart subtotal based on subscription
const updateActiveTab = (tab: string) => {
    checkoutStore.activeTab = tab;
    saveToStorage("sub", tab === 'subscribe' ? true : false, 'session');

    const bagQty = checkoutStore.cartData[0]?.BagsQty;
    formStore.formFields.shipProfile = updatedShipProfile(tab, bagQty!, config.shipProfiles)
    checkoutStore.calculateTotalPrice;

    const selectedGummyType = getFromStorage("selectedGummyType", 'session') || "ogBags";
    checkoutStore.selectedGummyType = selectedGummyType as 'ogBags' | 'sourBags';
    const type = checkoutStore.selectedGummyType;
    const selectedBag = ref(getFromStorage("selectedGummyBag", 'session') ? Number(getFromStorage("selectedGummyBag", 'session')) : 3);
    const variantId = tab === 'subscribe' ? config[`${type as 'ogBags' | 'sourBags'}Sub`][selectedBag.value - 1] : config[type as 'ogBags' | 'sourBags'][selectedBag.value - 1];

    if (!variantId) {
        console.error("Variant ID not found for the selected tab and bag quantity.");
        return;
    };

    checkoutStore.selectedQuantity = variantId;
    checkoutStore.addGummyProduct();
};

onMounted(async () => {
    saveToStorage("sub", true, 'session');
    saveToStorage("selectedGummyType", "ogBags", 'session');

    // initialize activeTab
    checkoutStore.activeTab = 'subscribe';

});

</script>

<template>
    <div>

        <!-- Tabs -->
        <div class="flex overflow-hidden">
            <div v-for="tab in tabs" :key="tab.key" @click="() => updateActiveTab(tab.key)"
                class="flex-1 py-4 lg:pl-5 cursor-pointer transition-all duration-200 flex flex-col items-start justify-center"
                :class="checkoutStore.activeTab === tab.key ? 'bg-white' : 'bg-gray-200'">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 border-2 shrink-0 rounded-full flex items-center justify-center ml-3 border-[#172969]"
                        :class="{ 'bg-[#172969]': checkoutStore.activeTab === tab.key }">
                        <NuxtImg v-if="checkoutStore.activeTab === tab.key" src="/images/whiteTick.svg"
                            alt="white-tick" />
                    </div>

                    <div class="flex flex-col">
                        <span class="font-medium text-[12px] lg:text-[16px] text-gray-800">{{ tab.label }}</span>
                        <span v-if="tab.desc && checkoutStore.activeTab === 'onetime'"
                            class="text-green-700 text-[12px] lg:text-lg font-semibold">
                            Save an extra ${{ (checkoutStore.calculateSubtotalPrice('productPrice', false) -
                                Number(checkoutStore.cartData[0]?.productPrice)).toFixed(2) }}
                        </span>

                        <span v-if="tab.desc && checkoutStore.activeTab === 'subscribe'"
                            class="text-green-700 text-[12px] lg:text-lg font-semibold">
                            You saved ${{ checkoutStore.cartData[0] ?
                                Number(checkoutStore.calculateBagPrice(checkoutStore.cartData[0]?.BagsQty!,
                                    checkoutStore.cartData[0]?.productPrice!) -
                                    Number(checkoutStore.cartData[0]?.productPrice)).toFixed(2) : "0.00" }}
                        </span>

                    </div>

                </div>
            </div>
        </div>

        <div class="mt-6 mb-3 px-5 pb-5">

            <!-- Subscribe & Save Tab -->
            <div v-if="checkoutStore.activeTab === 'subscribe'">
                <div class="flex space-x-3 items-center">
                    <p class="text-lg lg:text-xl text-red-700 line-through">
                        Total ${{ checkoutStore.calculateSubtotalPrice('compareAtPrice', false).toFixed(2) }}
                    </p>
                    <p class="text-green-600 extrablod text-lg lg:text-xl">
                        Total ${{ checkoutStore.calculateSubtotalPrice('productPrice', false).toFixed(2) }}
                    </p>
                </div>

                <div v-if="checkoutStore.cartData[0]?.BagsQty !== '1 Bag'" class="flex items-center gap-2 mt-5">
                    <span class="text-3xl">📦</span>
                    <span class="font-semibold">FREE SHIPPING</span>
                    <span class="text-gray-700">Every Time</span>
                </div>

                <div class="mt-5 space-y-4 lg:flex-row flex-col">
                    <div class="flex items-start space-x-3 w-full">
                        <div
                            class="bg-green-700 rounded-full min-w-10 min-h-10 flex items-center justify-center border-3 border-green-500">
                            <span class="text-white text-lg">✓</span>
                        </div>
                        <p class="text-sm">
                            <span class="font-black text-green-700 [text-shadow:0_0_0.8px_#15803d]">
                                Manage Your Subscription
                            </span>
                            <br /> Cancel, pause, or skip anytime!
                        </p>
                    </div>

                    <div class="flex items-start space-x-3 w-full">
                        <div
                            class="bg-[#172969] rounded-full min-w-10 min-h-10 flex items-center justify-center border-3 border-[#6e7eb8]">
                            <span class="text-white text-lg">$</span>
                        </div>
                        <p class="text-sm">
                            <span class="font-black text-[#172969] [text-shadow:0_0_0.8px_#172969]">
                                90-Day 200% Happiness Guarantee
                            </span>

                            <br /> If you don't love it, we’ll refund double what you paid!
                        </p>
                    </div>
                </div>
            </div>

            <!-- One-time purchase Tab -->
            <div v-if="checkoutStore.activeTab === 'onetime'">
                <div class="flex item-start space-x-3">
                    <NuxtImg src="/images/arrow-icon.png" alt="Arrow Icon" class="lg:h-[90px] h-[70px] w-auto" />
                    <div class="flex flex-col">
                        <p class="text-green-600 font-semibold text-lg lg:text-2xl lg:mb-2 mb-0">
                            Total ${{ checkoutStore.calculateSubtotalPrice('productPrice', false).toFixed(2) }}
                        </p>

                        <p v-if="checkoutStore.calculateSubtotalPrice('productPrice', false) === 58"
                            class="text-sm lg:text-lg text-gray-600">
                            You'll instantly save ${{ (checkoutStore.calculateSubtotalPrice('productPrice', false)
                                - Number(checkoutStore.cartData[0]?.productPrice)).toFixed(2) }}
                            when you subscribe. Plus, you can cancel or pause your subscription any time!
                        </p>

                        <p v-else class="text-sm lg:text-lg text-gray-600">
                            You'll instantly save ${{ (checkoutStore.calculateSubtotalPrice('productPrice', false)
                                - Number(checkoutStore.cartData[0]?.productPrice)).toFixed(2) }} and recieve FREE GIFTS when
                            you subscribe. Plus, you can easily pause, skip or cancel your subscription any time!
                        </p>

                        <!-- <p v-else class="text-sm lg:text-lg text-gray-600">
                            You'll instantly save ${{ (checkoutStore.calculateSubtotalPrice('productPrice', false)
                                - Number(checkoutStore.cartData[0]?.productPrice)).toFixed(2) }}
                            and get FREE SHIPPING and FREE GIFTS when you subscribe.
                            Plus, you can cancel or pause your subscription any time!
                        </p> -->

                    </div>
                </div>
            </div>

        </div>

    </div>

</template>
