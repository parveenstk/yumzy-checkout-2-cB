export default defineNuxtRouteMiddleware((to, from) => {

    // LP
    const lpParam = String(to.params.lp ?? '');
    const lpMatch = lpParam.match(/^lp(\d+)$/);

    if (!lpMatch) {
        return navigateTo('/error');
    }

    const lp = Number(lpMatch[1]); // the number after "lp"
    const isValidLp = lp >= 1 && lp <= 3; // example lp range
    if (!isValidLp) {
        return navigateTo('/error');
    }

    saveToStorage("lpParam", lpParam, "session");

    return;
});
