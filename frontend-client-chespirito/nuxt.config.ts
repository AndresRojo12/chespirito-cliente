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
    async routes() {
      const categories = await fetch(`${process.env.API_BASE_URL}/categories`)
        .then(res => res.json());
      const products = await fetch(`${process.env.API_BASE_URL}/products`)
        .then(res => res.json());
      
      const categoryRoutes = categories.map((category) => `/categories/${category.id}`);
      const productRoutes = products.map((product) => `/products/${product.id}`);

      return [...categoryRoutes, ...productRoutes];
    }
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
