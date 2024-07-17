import vsharp from "vite-plugin-vsharp";

export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/landing"],
    },
  },
  vite: {
    plugins: [vsharp()],
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
  ],
  supabase: {
    redirect: false,
  },
});
