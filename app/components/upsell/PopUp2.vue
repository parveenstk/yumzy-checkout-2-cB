<script setup lang="ts">
import { useCheckoutStore } from '~~/stores';

const emit = defineEmits(['close'])

// checkout Store
const checkoutStore = useCheckoutStore();
const router = useRouter();

// useTimer composable
const { minutes, seconds, isExpired, startTimer } = useTimer()

onMounted(() => {
    startTimer()
})

const productDetails: any = ref({
    productId: env().offer2_1,
    productQty: 1,
    productPrice: "81",
    variantDetailId: "",
    pageTo: "/thankyou",
    event: "Upsell2cv"
});

// Route to next page
const mayBeLater = async () => {
    updatePage();
    router.push({ path: '/thankyou' });
}

</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">

            <!-- Backdrop (NO CLICK CLOSE HERE) -->
            <div class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" role="dialog"
                aria-modal="true">
                <Transition enter-active-class="transition-transform duration-200" enter-from-class="scale-95 opacity-0"
                    enter-to-class="scale-100 opacity-100" leave-active-class="transition-transform duration-150"
                    leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">

                    <!-- Panel (NO CLICK CLOSE HERE EITHER) -->
                    <div
                        class="popup bg-white border-dashed border-[#e6193c] border-3 p-[20px_5px_15px_5px] lg:p-[40px_40px_45px] mx-auto text-center rounded-[.5rem] w-190">
                        <h3 class="text-[#ffeb00] bg-[#e6193c] text-3xl md:text-5xl w-fit mx-auto extrablod p-3">
                            WAIT!
                        </h3>
                        <h4 class="text-xl md:text-2xl extrablod my-3">
                            For the NEXT 3 MINUTES <u>ONLY</u>,
                            <br />
                            <span>Get Yumzy Sours</span> <br />
                            <span>as low as <span class="text-[#e6193c] extrablod">$27 per bag!</span></span>
                        </h4>
                        <p class="text-xl md:text-2xl font-extrabold mb-3">Tap below to get this exclusive <br />
                            <span>
                                <span class="extrablod">one time</span> offer.</span>
                        </p>
                        <p class="text-lg font-extrabold mb-1 leading-6">
                            Special discount applied. <br> Tap below to
                            get 3 Bags of Yumzy Sours for only $27 per bag!
                        </p>

                        <!-- Timer -->
                        <div class="extrablod text-md md:text-lg">
                            <p>
                                <span class="text-black text-md">Offer expires in :</span><br />

                                <!-- Timer running -->
                                <span v-if="!isExpired" class="text-[#e6193c] extrablod text-3xl">
                                    {{ minutes }}:{{ seconds }}
                                </span>

                                <!-- Timer expired -->
                                <span v-else class="text-[#e6193c] extrablod text-3xl">
                                    Offer Expired
                                </span>

                            </p>
                        </div>

                        <div class="flex flex-col gap-1">
                            <div @click="() => importUpsell(productDetails)" v-if="!checkoutStore.transactionStatus"
                                class=" relative inline-block lg:mt-5 mt-3 mx-auto w-fit rounded-full bg-[#1EB9F0]
                                cursor-pointer">
                                <span
                                    class="relative block text-[#1EB9F0] bg-white border-1 border-[#1EB9F0] rounded-full py-[12px] lg:px-[40px] px-[20px] text-[calc(1.2rem-0px)] lg:text-[calc(1.5rem-0px)] leading-[calc(1em+1vw)] extrablod translate-x-[-4px] translate-y-[-4px] transition-transform duration-250 hover:translate-x-[-7px] hover:translate-y-[-6px]">
                                    Yes, Send This Deal
                                </span>
                            </div>

                            <!-- Loader -->
                            <div name="loader" v-if="checkoutStore.transactionStatus"
                                class="lg:mt-5 mt-2 bg-[#1EB9F0] py-[12px] px-[40px] md:w-[80%] lg:w-[55%] w-[80%] mx-auto flex justify-center items-center rounded-full cursor-pointer text-pixel">
                                <NuxtImg
                                    class="w-12 h-[calc(7.5vw-0px)] md:h-[calc(5.5vw-0px)] lg:h-[calc(3.5vw-0px)] xl:h-[calc(2.7vw-0px)]"
                                    src="/images/loader.svg" alt="loader.svg" />
                            </div>

                            <div @click="mayBeLater"
                                class=" popup text-black text-sm lg:text-md font-bold underline mt-2 cursor-pointer">
                                No thanks, don't send this 3-bag special.
                            </div>
                        </div>
                    </div>

                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>
