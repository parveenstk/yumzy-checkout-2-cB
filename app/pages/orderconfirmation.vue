<script lang="ts" setup>

// meta tag details
useHead({
    title: 'Thank You for Your Order | Yumzy',
    meta: [
        { name: 'description', content: 'Your Yumzy order has been placed successfully. A confirmation email has been sent to your registered address.' },
    ],
})

const orderDetails = ref<OrderDetail[]>([]);
const totalAmount = ref('0.00');
const shippingAmount = ref('0.00');

onMounted(() => {
    const savedOrderDetails = getFromStorage('savedOrderDetails', 'session') as SavedOrderDetails;
    // console.log('Saved Order Details:', savedOrderDetails);

    if (savedOrderDetails && Array.isArray(savedOrderDetails.items)) {
        orderDetails.value = savedOrderDetails.items;
        totalAmount.value = savedOrderDetails.totalAmount || '0.00';
        shippingAmount.value = savedOrderDetails.shipProfileId === 38 ? 'Free' : `$${savedOrderDetails.shipTotal}`;
    }

    setTimeout(() => {
        cleanStorage();
    }, 500)
});

</script>

<template>
    <main>
        <section class="lg:py-10 py-4 bg-[#e9e9e9]">

            <div class="max-w-3xl mx-auto">
                <NuxtImg class="mx-auto mb-8" src="/images/logo.png" width="200" height="80" loading="eager"
                    alt="yomz-logo" />
                <h1 class="lg:text-3xl text-2xl extrablod text-center lg:px-0 px-3">Congratulations! Your Order Is
                    Complete!
                </h1>
                <p class="text-center lg:text-lg text-xs lg:px-0 px-3">
                    Within a few minutes you will receive an order confirmation email with your order ID.
                    below you can find all the products you purchased...
                </p>
            </div>

            <div class="max-w-xl mx-auto bg-white p-3 mt-4 rounded-xl">
                <div class="innerscan bg-gray-100 p-2 rounded-xl">
                    <h1 class="text-center lg:text-3xl text-2xl mt-4 extrablod lg:px-3 px-0">
                        Download the YOMZ App on Your Phone
                    </h1>
                    <p class="text-center mt-4 lg:px-3 px-0 ">
                        Your personalized plan and coach support are only available via the mobile app.
                        Here's how to download it
                    </p>
                    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 gap-4 lg:p-3 p-0 mt-4 items-center">
                        <div class="bar-details">
                            <div class="flex gap-2">
                                <div class="num-data">
                                    <span
                                        class="flex bg-[#1EB9F0] text-white justify-center items-center w-8 h-8 rounded-full extrablod">2</span>
                                </div>
                                <div class="num-details mb-6">
                                    <p class="lg:text-xl text-sm">
                                        <strong class="lg:block inline">
                                            Open the YOMZ app on your phone
                                        </strong>
                                        by scanning the QR code on the right
                                    </p>
                                </div>
                            </div>
                            <NuxtImg src="/images/googleplay.png" alt="googleplay.png-Img"
                                class="w-full mb-3 lg:px-0 px-15" />
                            <NuxtImg src="/images/appstore.png" alt="appstore.png-Img" class="w-full lg:px-0 px-15" />
                        </div>
                        <div class="bar-details">
                            <NuxtImg src="/images/qr.png" alt="qr.png-Img" class="w-full rounded-xl lg:px-0 px-15" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-3 gap-4 p-1 mt-4 items-center">
                        <div class="bar-details">
                            <div class="flex gap-2">
                                <div class="num-data">
                                    <span
                                        class="flex bg-[#1EB9F0] text-white justify-center items-center w-8 h-8 rounded-full extrablod">2</span>
                                </div>
                                <div class="num-details mb-6">
                                    <p class="lg:text-xl text-sm">
                                        <strong>Enter the email</strong> you used when placing your order
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="email-images">
                            <NuxtImg src="/images/enteremail.png" alt="enteremail.png-Img" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="sec-section">
                    <h1 class="text-center text-2xl font-bold mt-12 extrablod">BOOK YOUR YOMZ PROTOCOL REVIEW CALL</h1>
                    <p class="text-center mt-2"> <strong>Schedule a 15-minute protocol review</strong> with our Protocol
                        Review Team. This call aims to enhance your YOMZ product
                        experience, offer lifestyle guidance & ensure optimal results.
                    </p>
                    <p class="text-center mt-2"><strong>Click the button below and book your all now.</strong> We look
                        forward to speaking with you soon!
                    </p>
                    <div class="p-4 mb-6">
                        <button type="button"
                            class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                            <span class="block lg:text-bease text-lg  font-bold">BOOK YOUR CALL NOW</span></button>
                    </div>

                    <!-- Your Product Receipt -->
                    <div class="products-receipt">
                        <p class="flex gap-1 items-center w-full bg-[#e9e9e9] p-2 extrablod mb-2">
                            <NuxtImg src="/images/round-check.svg" alt="round-check.svg-Img" /> Your Product Receipt:
                        </p>
                        <p class="flex justify-between items-center mb-2">
                            <span class="font-bold">Item</span>
                            <span class="font-bold">Price</span>
                        </p>

                        <!-- Product Details -->
                        <div v-if="orderDetails.length">
                            <p v-for="(item, index) in orderDetails" :key="index"
                                class="flex justify-between items-center mb-2">
                                <span>{{ index !== 0 ? item.name : item.title }}</span>
                                <span>${{ item.price }}</span>
                            </p>
                        </div>

                        <hr class="my-5">
                        <p class="flex justify-between items-center">
                            <span class="font-bold">Tax</span>
                            <span class="font-bold">$0.00</span>
                        </p>

                        <!-- shipping price -->
                        <p class="flex justify-between items-center">
                            <span class="font-bold">Shipping</span>
                            <span class="font-bold">{{ shippingAmount }}</span>
                        </p>

                        <!-- total amount -->
                        <p class="flex justify-between items-center">
                            <span class="font-bold">Total:</span>
                            <span class="font-bold">${{ totalAmount }}</span>
                        </p>

                        <!-- Our Guarantee -->
                        <p class="flex gap-1 items-center w-full bg-[#e9e9e9] p-2 extrablod mb-2 mt-5">
                            <NuxtImg src="/images/lock.svg" alt="lock.svg-Img" /> Our Guarantee:
                        </p>
                        <div class="lg:flex block gap-3 lg:p-4 p-1 mb-3">
                            <div class="items-center justify-center flex">
                                <NuxtImg src="/images/guarantee.png" alt="guarantee.png-Img"
                                    class="lg:w-full w-20 mb-3" />
                            </div>
                            <div>
                                <p class="text-gray-700 leading-[1.2] text-center sm:text-left"> Your
                                    order today is protected by our ridiculously iron-clad Picky Momz 90-day <span
                                        class="font-bold">200% Happiness Guarantee.</span> If you’re not
                                    happy with how <span class="font-bold">great</span> you and your
                                    family feel, or how improved your energy, focus, and gut issues are, then let us
                                    know
                                    anytime in the next <span class="font-bold">90 days.</span> We’ll
                                    refund <span class="font-bold">DOUBLE</span> what you paid.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="max-w-xl mx-auto bg-white p-3 mt-8">
                <h1 class="w-full bg-[#e9e9e9] lg:p-2 p-2 extrablod mb-2 lg:text-2xl text-xl text-center">
                    While you are waiting for your order...
                </h1>
                <h2 class="text-center lg:my-5 my-3 underline lg:text-2xl text-base font-bold">
                    HERE ARE OUR GIFTS FOR YOU :)
                </h2>
                <p class="w-full bg-[#e9e9e9] p-2 extrablod mb-2 text-center">FREE Swelling Relief Course</p>
                <NuxtImg src="/images/cam1.jpg" alt="cam1.jpg-Img" class="w-full" />
                <div class="p-4 mb-3">
                    <button type="button"
                        class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                        <span class="block lg:text-bease text-lg  font-bold">GET FREE ACCESS NOW</span></button>
                </div>
                <div class="grid lg:grid-cols-2 grid-cols-1  gap-2">
                    <div>
                        <p class="w-full bg-[#e9e9e9] p-2 extrablod mb-2 text-center">Swelling Relief Nutrition Plan</p>
                        <NuxtImg src="/images/4.jpg" alt="4.jpg-Img" class="w-full" />
                        <div class="p-0 mb-3">
                            <button type="button"
                                class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                                <span class="block lg:text-bease text-lg  font-bold">GET FREE ACCESS NOW</span></button>
                        </div>
                    </div>
                    <div>
                        <p class="w-full bg-[#e9e9e9] p-2 extrablod mb-2 text-center">Swelling Relief Nutrition Plan</p>
                        <NuxtImg src="/images/4.jpg" alt="4.jpg-Img" class="w-full" />
                        <div class="p-0 mb-3">
                            <button type="button"
                                class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                                <span class="block lg:text-bease text-lg  font-bold">GET FREE ACCESS NOW</span></button>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <h1 class="text-center my-5 underline lg:text-2xl text-xl font-bold">PLEASE ALSO CHECK THESE
                    RESOURCES...
                </h1>
                <div class="grid lg:grid-cols-2 grid-cols-1  gap-2">
                    <div>
                        <p class="w-full bg-[#e9e9e9] p-2 extrablod mb-2 text-center">How it works</p>
                        <NuxtImg src="/images/4.jpg" alt="4.jpg-Img" class="w-full" />
                        <div class="p-0 mb-3">
                            <button type="button"
                                class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                                <span class="block lg:text-bease text-lg  font-bold">CHECK IT NOW</span></button>
                        </div>
                    </div>
                    <div>
                        <p class="w-full bg-[#e9e9e9] p-2 extrablod mb-2 text-center">User Manual</p>
                        <NuxtImg src="/images/4.jpg" alt="4.jpg-Img" class="w-full" />
                        <div class="p-0 mb-3">
                            <button type="button"
                                class="rounded-xl shadow-lg block w-full  text-center p-3 bg-[#FFEB00] text-black">
                                <span class="block lg:text-bease text-lg font-bold">CHECK IT NOW</span></button>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-[#1EB9F0] lg:py-7 py-3">
        <div class="mx-auto max-w-5xl text-center">
            <NuxtImg src="/images/logo.png" alt="logo.png-Img" class="max-w-30 mx-auto mb-4" />
            <p class="text-white lg:text-lg text-sm">By filling out the field, you consent for YOMZ™ to use automated
                technology,
                including texts and
                prerecorded messages, to contact you at the number and email provided about YOMZ™ offers.
            </p>
        </div>
    </footer>
</template>
