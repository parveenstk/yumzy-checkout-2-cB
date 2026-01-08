export const keyPoints = [
    "Fills in your family’s nutrition gaps and helps transform their lives!",
    "Packed with vitamins, antioxidants, prebiotics, and probiotics",
    "One serving is the phytonutrient equal of 2 servings of fruits & vegetables",
    "The longer you eat them every day, the more stacked the benefits",
    "No risk for you with our 90-Day 200% Happiness Guarantee",
];

export const faqs = [
    {
        "question": "Is Yumzy worth it?",
        "answer": "You can't put a price on your family's health, can you? That's why we've made it possible to pay as little as $1.14 per day per family member to improve your family's nutrition."
    },

    {
        "question": "How long does it take to receive my order?",
        "answer": "With Standard Shipping, your order should arrive in 3-5 days. However, we’ve noticed many families want it sooner, so there’s an option for expedited shipping. This means it should arrive in 2 days."
    },

    // {
    //     "question": "Do I have to subscribe?",
    //     "answer": `No, you don't. We offer a one-time purchase option for both OG Gummies and Sour Gummies so you can try Yumzy worry-free. Just select the "One-time purchase" option. If you love Yumzy, you can upgrade to a subscription anytime. Especially since that's the only way to get the best savings, FREE shipping, and 4 FREE gifts.`
    // },

    {
        "question": "What is the difference between Yumzy and YOMZ?",
        "answer": "Yumzy is the family supplement brand that makes the products YOMZ OG Gummies and YOMZ Sour Gummies."
    },

    {
        "question": "How many bags do I need for my family?",
        "answer": "One bag of YOMZ Gummies is filled with 28 packs. Each pack equals a daily serving for 1 person. So 1 family member = 1 bag of nutrition for 28 days. This means how many bags you need depends on how many family members you want to help. Also, don't forget - the more bags you order, the more money you save."
    },

    {
        "question": "Where is Yumzy manufactured?",
        "answer": "We’re proud to manufacture our tasty gummies in the USA. We use premium ingredients in our state-of-the-art facility, which is FDA-registered and GMP-certified. Then YOMZ is 3rd-party tested to ensure top-shelf quality."
    },

    {
        "question": "What if Yumzy is not for me - is there a refund?",
        "answer": "Your order today is protected by our 90-Day 200% Happiness Guarantee. We’re so confident in the real food-based nutrition inside every YOMZ gummy that we’re sure you won’t need it. But you deserve ZERO stress when fighting for your family’s health, so here’s how it works: If you don’t see a difference in your family’s focus, digestion, energy, even your kid’s tantrum tempo… If they taste it and give you the dreaded thumbs down… Or if YOMZ doesn’t feel like the win you needed… You get back double what you paid. See Yumzy's Terms and Conditions for details."
    },

    {
        "question": "Do YOMZ Gummies really taste that good?",
        "answer": "Yes, they really do. In our experience, no matter how healthy something is, it doesn’t matter if it doesn’t taste good - because who’ll want to eat it every day? So at Yumzy, we craft our YOMZ Gummies flavor-first. Besides, with a name like YOMZ, it has to taste phenomenal. Now it's your turn to find out!"
    },

    {
        "question": "Is Yumzy safe for kids?",
        "answer": "Yes. Family is one of our 3 core values, so it has to be safe for ages 2 to 102. That’s why Yumzy has no artificial dyes, flavors, or other junk. It’s free of GMOs, gluten, and dairy plus vegan-friendly."
    }
];

export const reviewsData = [
    {
        name: 'Deb M.',
        img: '/images/rw-1.jpg',
        title: 'Love the taste',
        text: `My kids think they’re candy and ask for them daily. I’m happy they love the taste, but also love that they’re getting their daily nutrition.`,
        date: '10/10/25',
    },
    {
        name: 'Misty C.',
        img: '/images/rw-3.jpg',
        title: 'We\'re crazy about them...',
        text: `I bought one bag for the family to try. And we loved them. My kids went crazy. Now we all have our own subscription.`,
        date: '10/9/25',
    },
    {
        name: 'Sheila T.',
        img: '/images/rw-2.jpg',
        title: 'Getting the nutrition she needs',
        text: `My child is such a picky eater. It’s impossible to get her to eat vegetables. It’s nice knowing she gets all her nutrition.`,
        date: '10/7/25',
    },
];

export const guaranteeData = [
    "Today's order is protected by ",
    "Yumzy's ironclad <strong>90-day</strong> ",
    "<strong>200% Happiness Guarantee.</strong> If you're ",
    "not happy with how improved your and ",
    "your family's energy, focus, and gut ",
    "issues are, let us know anytime in the ",
    "next 90 days. We'll refund DOUBLE ",
    "what you paid. ",
    "See Terms and Conditions for details."
]

export const tabs = [
    {
        key: 'subscribe',
        label: 'Subscribe & Save',
        desc: '(Save an extra $X.XX)'
    },
    {
        key: 'onetime',
        label: 'One-time purchase',
        desc: ''
    },
]

export const termsAndCondition = (price: string) => [
    `By clicking COMPLETE PURCHASE below, I confirm that I have read and agree to the Terms of Use and Privacy Policy. I acknowledge that my subscription will automatically renew at $${price} every 4 weeks until I cancel. I understand that I can easily cancel anytime by contacting the Yumzy Customer Success team. <strong><u>I understand that my order is protected by Yumzy's 200% Happiness Money Back Guarantee. </u> </strong>`,
    "🔒 By tapping COMPLETE PURCHASE below, you accept Yumzy's Privacy Policy and Terms of Use."
]

// Header.vue content
export const headerContent = {
    logo: {
        src: "/images/logo.png",
        alt: "Yumzy Logo",
    },

    ssl: {
        src: "/images/ssl.png",
        alt: "SSL Secure Checkout",
        width: 104,
        height: 46,
    },

    flag: {
        src: "/images/flag.png",
        alt: "US Flag",
        width: 64,
        height: 38,
    },

    contact: {
        label: "Contact Us:",
        email: "support@yumzy.com",
        mailto: "mailto:support@yumzy.com",
    },
}

// Footer.vue content
export const footerContent = {
    links: [
        { label: "Terms & Conditions", url: "/" },
        { label: "Privacy Policy / CCPA", url: "/" },
        { label: "Returns", url: "/" },
    ],

    disclaimer: `By filling out the field, you consent for Yumzy to use automated technology, including texts and prerecorded messages, to contact you at the number and email provided about Yumzy offers.`,

    dmca: {
        src: "/images/dmca.png",
        alt: "DMCA Protection",
        height: "24",
    },
}
