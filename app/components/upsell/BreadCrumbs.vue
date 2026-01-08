<script setup>
defineProps({
    optNumbar: String
})

</script>
<template>
    <div class="mx-auto flex items-center justify-center lg:px-2 px-0 py-2 lg:py-2">
        <div class="flex items-center justify-center bg-[#F1F1F1] border-2 border-[#DFDFDF] rounded-xl w-fit">
            <!-- Step 1 -->
            <div class="flex items-center ">
                <div class="flex items-center space-x-2 extrablod lg:px-4 px-1 pr-0">
                    <div
                        class="lg:w-10 lg:h-10 w-6 h-6 shrink-0  flex items-center justify-center rounded-full bg-[#1EB9F0] border-0 text-gray-500 font-bold">
                        <NuxtImg src="/images/upselcheck.svg" alt="upselcheck.svg-Img"
                            class="lg:w-6 lg:h-6 w-3 h-3 p-0" />
                    </div>
                    <p class="font-semibold lg:text-lg text-[11.5px] leading-3 odr-text">Order Approved</p>
                </div>
            </div>

            <!-- Step 2 -->
            <div
                class=" relative bg-[#1EB9F0] lg:h-15 lg:w-60 h-10 w-35 flex items-center extrablod text-white font-black px-6 pr-0">
                <!-- Step Circle -->
                <div
                    class="lg:w-10 lg:h-10 w-6 h-6 flex lg:text-2xl text-lg shrink-0 items-center justify-center rounded-full bg-white text-[#1EB9F0] font-bold border lg:mr-3 mr-1">
                    2
                </div>
                <!-- Step Text -->
                <p class="lg:text-lg text-xs text-[11.5px] leading-3 odr-text">Customize Order</p>

                <!-- Left Arrow -->
                <div class="absolute left-[0px] top-0 w-0 h-0 
                  lg:border-t-[30px] border-t-[20px] border-t-transparent 
                  lg:border-l-[20px] border-l-[15px] border-l-[#F1F1F1] 
                  lg:border-b-[30px] border-b-[20px] border-b-transparent">
                </div>

                <!-- Right Arrow -->
                <div class="absolute lg:right-[-20px] right-[-15px]  top-0 w-0 h-0 
                  lg:border-t-[30px] border-t-[20px] border-t-transparent 
                  lg:border-l-[20px] border-l-[15px] border-l-[#1EB9F0] 
                  lg:border-b-[30px] border-b-[20px] border-b-transparent">
                </div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-center">
                <div class="flex items-center space-x-2 px-4 lg:pr-4 lg:pl-8 pr-0  pl-4.5 extrablod">
                    <div
                        class="lg:w-10 lg:h-10 w-6 h-6 flex lg:text-2xl text-lg 
                        shrink-0  aspect-squares items-center justify-center rounded-full bg-white text-[#1EB9F0] font-bold border">
                        3
                    </div>
                    <p class="extrablod lg:text-lg text-[11.5px] leading-3 odr-text">Final Confirmation</p>
                </div>
            </div>
        </div>
    </div>

    <p class="text-center lg:text-lg text-sm">
        **Please do <span class="underline extrablod">not</span>
        hit your back button. You might accidentally place a double order.**
    </p>
    <div class="flex items-center justify-center m-3">
        <h3
            class="bg-[#F1F1F1] lg:w-160 w-full text-center lg:text-2xl text-sm py-2 font-semibold border-2 border-[#DFDFDF] rounded-xl">
            Option {{ optNumbar }} of 3 to Customize Your Order
        </h3>
    </div>
</template>