export const checkSteps = async () => {

    const router = useRouter();
    const stepCompleted = getFromStorage('stepCompleted', 'local');
    if (stepCompleted === null || stepCompleted === undefined) return

    // Switch based on the value of `stepCompleted`
    switch (+stepCompleted) {
        case 1:
            return router.push({ path: '/upsell1' });  // Use router.push for navigation
        case 2:
            return router.push({ path: '/upsell2' });
        default:

            // Optionally handle a default case, if needed
            return router.push('/error');  // Redirect to a fallback route
    }
};