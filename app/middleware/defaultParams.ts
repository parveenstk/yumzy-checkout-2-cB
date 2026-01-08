export default defineNuxtRouteMiddleware(() => {

    // set default in session when root is access
    saveToStorage("lpParam", "default", "session");
    return;
});
