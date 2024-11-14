import process from "process";

export default defineNuxtConfig({
  head: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
      },
      {
        rel: "icon", href: "/frontend-client-chespirito/static/favicon.ico"
      }
    ],
  },
  modules: ["@nuxtjs/sitemap"],
  site: {
    url: "https://www.antiguedadeschespirito.com",
  },
  sitemap: {
    hostname: "https://www.antiguedadeschespirito.com",
    gzip: true,
    routes: [
      
    ],
  },
  devtools: { enabled: true },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify", "vuejs3-datepicker"],
  },
  generate: {
    dir: "dist",
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      WPP: process.env.WPP,
      FACEBOOK: process.env.PUBLIC_FACEBOOK,
    },
  },
});
