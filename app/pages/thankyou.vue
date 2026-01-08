<script setup lang="ts">
import { useOrderDataLayer, useUpsellsDataLayer } from '~/composables/useGtm.client';
import { fbCAPI, UpsellsfbCAPI } from '../composables/common';


// Meta tag details (for SEO/metadata)
metaData("Thank You - Order Complete | Yumzy", " Your Order is Confirmed | Yumzy");

const router = useRouter();
const checkPixel = router.options.history.state;
onMounted(() => {
    if (checkPixel.from && checkPixel.from == 'importupsell') {
        UpsellsfbCAPI(checkPixel.datalayerobj);
        useUpsellsDataLayer(checkPixel.datalayerobj);
        fbCAPI("OrderTotals");
        useOrderDataLayer('OrderTotals');
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
    // to clear the storage
    setTimeout(() => {
        cleanStorage();
    }, 500)
})

</script>

<template>
    <section class="upsell bg-[#efefef] py-2 px-3 lg:p-4">
        <div class="container max-w-[1120px] mx-auto lg:px-3">
            <div
                class="border shadow-[0px_2px_10px_rgb(204,204,204)] rounded-[10px] border-gray-300 bg-white lg:py-[3rem] py-3 lg:px-[7.5rem] md:px-5 px-1">
                <div class="mx-auto text-center relative">
                    <NuxtImg src="/images/logo.png" alt="logo.png-Img"
                        class="lg:mb-3 mb-2 mx-auto lg:w-[200px] w-[20%]" />

                    <h1
                        class="gothic mt-2 lg:mt-4 text-[calc(7vw-0px)] md:text-[calc(2.5vw-0px)] leading-[calc(.9em+1vw)] md:leading-[calc(.7em+1vw)] font-extrabold">
                        Order Complete.<p class="sm:block md:inline md:ml-1">Thank you!</p>
                    </h1>
                    <div class="fnt_rg font-medium my-2 md:mt-5 md:mb-10 text-md md:text-lg px-1 md:px-0">
                        <p>Welcome to the Yumzy Family!</p>
                        <p>We are excited to get your product rushed out to you to help optimize your families
                            nuturition.
                        </p>
                        <p class="mt-2">Next, look for an email from us entitled:</p>
                        <p>"Order Confirmation - Yumzy Gummies".</p>
                        <div>If it's not in your inbox,
                            <p class="sm:block md:inline">
                                check your spam folder. If you have any questions or feedback,
                            </p>
                        </div>
                        <p>email us at support@Yumzy.com.</p>
                        <p>
                            Once again, <span class="extrablod">thank you</span> for your order and welcome to the <span
                                class="extrablod">Yumzy Family!</span>
                        </p>
                    </div>

                    <!-- Nastya & Dr. Pam GIF -->
                    <NuxtImg class="w-full" src="https://get.yumzy.com/video/thankyou/thankyou.gif"
                        alt="thankyou.gif" />

                    <footer class="md:mt-12 mt-3">
                        <NuxtImg src="/images/ssl.webp" alt="ssl.webp-Img" class="w-[70%] lg:w-[30%] mb-0 mx-auto" />
                        <!-- <div class="safety flex justify-center flex-wrap lg:flex-nowrap">
                            <NuxtImg src="/images/guarantee.png" class="w-25 h-25 mx-auto md:mr-6" />
                            <div class="cont text-[12px] font-semibold gothic text-[#444444]">
                                <p>*Free shipping to contiguous U.S. only.</p>
                                <p>90-day 200% MONEY-BACK GUARANTEE: If you’re not absolutely thrilled with Pure Vibez
                                    Herbal Tonic, contact us within 90 days of receipt of your order. For more details,
                                    email our YOMZ-some Customer Experience Team at the address below. It's time to
                                    reclaim your "A" game!</p>
                                <p class="mt-3 text-[12px] font-semibold">Copyright 2025 © support@Yumzy.com</p>
                            </div>
                        </div> -->
                    </footer>
                </div>

            </div>
        </div>
    </section>
</template>
