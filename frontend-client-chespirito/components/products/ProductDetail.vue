<template>
  <section v-if="product">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>

    <section ref="productDetails" id="product-details" class="product-item1">
      <h1 class="product-name">{{ product.name }}</h1>
      <div class="main-image">
        <img
          class="product-image"
          :src="getImageUrl(product.imagePath1)"
          @click="openImage(product.imagePath1)"
        />
        <img
          class="product-image"
          :src="getImageUrl(product.imagePath2)"
          @click="openImage(product.imagePath2)"
        />
      </div>
      <div style="text-align: center">
        <p class="product-description">Estado {{ product.status }}</p>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">{{ formatPrice(product.price) }}</p>
      </div>
      <v-card-actions
        ><v-btn class="contact-button" :href="generateWhatsappLink(product)"
          >Contactar al vendedor</v-btn
        ></v-card-actions
      >
    </section>

    <v-dialog v-model="dialog" max-width="80vw">
      <div class="d-flex justify-end">
        <v-btn class="close-button" icon @click="closeImage">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-img :src="selectedImage" :max-height="maxHeight"></v-img>
    </v-dialog>

    <v-divider class="custom-divider"></v-divider>

    <section class="main-container">
      <h1 class="subtitle">Productos relacionados</h1>
      <v-carousel
        height="auto"
        hide-delimiters
        v-model="currentCardIndex"
        @change="handleCardChange"
      >
        <v-carousel-item
          v-for="index in Math.ceil(filteredByCategory.length / itemsPerRow)"
          :key="index"
        >
          <v-row class="carousel-row">
            <v-col
              v-for="product in filteredByCategory.slice(
                (index - 1) * itemsPerRow,
                index * itemsPerRow
              )"
              :key="product.id"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="product-item2">
                <v-card-title>
                  <h6 class="name-text">{{ product.name }}</h6>
                </v-card-title>
                <div>
                  <img
                    class="product-image-corousel"
                    :src="getImageUrl(product.imagePath1)"
                  />
                  <p class="description-text">{{ product.description }}</p>
                  <p class="price-text">{{ formatPrice(product.price) }}</p>
                </div>
                <v-card-actions>
                  <v-btn class="contact-button" @click="viewDetails(product.id)">
                    Ver más
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </section>
  </section>
  <v-container v-else>
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const productDetails = ref(null);
const { width } = useDisplay();

const { id } = route.params;
const product = ref(null);
const products = ref([]);
const error = ref(null);
const currentCardIndex = ref(0);
const dialog = ref(false);
const selectedImage = ref("");
const maxHeight = ref("80vh");
const selectedCategory = ref();
const isLoading = ref(false);

onMounted(() => {
  if (route.state && route.state.scrollToDetails) {
    productDetails.value?.scrollIntoView({ behavior: "smooth" });
  }
});

const fetchProduct = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/products/${id}`
    );
    product.value = data.value;
    selectedCategory.value = data.value.categoryId;
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

const getProducts = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}/products`, {
      method: "GET",
    });
    products.value = data.value.data;
    currentCardIndex.value = 0;
  } catch (error) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

const filteredByCategory = computed(() => {
  return products.value.filter(
    (product) => product.categoryId === selectedCategory.value
  );
});

const itemsPerRow = computed(() => {
  if (width.value >= 600 && width.value <= 970) {
    return 2;
  } else if (width.value > 970) {
    return 4;
  } else {
    return 1;
  }
});

onMounted(async () => {
  await nextTick();
  await fetchProduct();
  await getProducts();
});

const getImageUrl = (imagePath) => {
  return imagePath;
};

const generateWhatsappLink = (product) => {
  const message = `Hola, me interesa este producto.\nNombre: ${
    product.name
  }\nDescripción: ${product.description}\nPrecio: ${
    product.price
  }\nImagen: ${getImageUrl(
    product.imagePath
  )}\n¿Me podrías dar más información?`;
  return `https://wa.me/${CONFIG.public.WPP}?text=${encodeURIComponent(
    message
  )}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};

watch(filteredByCategory, (newProducts) => {
  if (currentCardIndex.value >= newProducts.length) {
    currentCardIndex.value = newProducts.length - 1;
  }
});

const handleCardChange = (newIndex) => {
  if (newIndex >= filteredByCategory.value.length) {
    currentCardIndex.value = filteredByCategory.value.length - 1;
  } else {
    currentCardIndex.value = newIndex;
  }
};

const openImage = (imagePath) => {
  selectedImage.value = imagePath;
  dialog.value = true;
};

const closeImage = () => {
  dialog.value = false;
};

const viewDetails = async (productId) => {
  await router.push({
    path: `/products/${productId}`,
    hash: "#product-details",
  });
  await nextTick();
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.custom-divider {
  width: 94.7vw;
  margin: 1%;
}
.product-name {
  font-family: "Poppins", sans-serif;
  padding: 1%;
  text-align: center;
  font-size: 2rem;
  color: #222222;
}
.product-description,
.product-status {
  font-family: "Poppins", sans-serif;
  margin: 0.5%;
  font-size: 1rem;
  color: #333333;
}
.product-price {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: #333333;
  padding: 1%;
  font-weight: bold;
}
.contact-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  border: none;
}
.category-title {
  font-size: 2rem;
  color: #222222;
  font-family: "Poppins", sans-serif;
}
.subtitle {
  font-family: "Poppins", sans-serif;
  text-align: center;
  font-size: 2rem;
  color: #222222;
}
.product-item1 {
  max-width: 100%;
  align-content: center;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(0, 183, 162, 0.02)
  );
  padding: 2%;
  border-radius: 0.5%;
}
.main-image {
  display: flex;
  justify-content: center;
}
.product-item2 {
  transition: transform 0.3s ease;
  max-width: 22%;
  height: auto;
  box-sizing: border-box;
  text-align: start;
  border-radius: 1%;
}
.product-item2:hover {
  transform: scale(1.1);
}
.product-image {
  width: 600px;
  cursor: pointer;
}
.v-card {
  text-align: center;
  max-width: 100%;
  box-sizing: border-box;
  text-align: center;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.product-image-corousel {
  width: 100%;
  padding: 4%;
  height: auto;
}
.name-text {
  margin-top: 10%;
  font-family: "Poppins", sans-serif;
  text-align: center;
  font-size: 1.5rem;
  color: #222222;
}
.status-text,
.description-text {
  font-size: 1rem;
  color: #333333;
  text-align: center;
  font-family: "Poppins", sans-serif;
}
.price-text {
  font-size: 1rem;
  color: #222222;
  text-align: center;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
}
.contact-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  border: none;
}

@media (min-width: 541px) and (max-width: 1024px) {
  .main-image {
    display: block;
    text-align: center;
  }
  .product-image {
    max-width: 50%;
  }
  .product-name {
    font-size: 4vw;
  }
  .product-item2:hover {
    transform: none;
  }
  .product-description,
  .product-price {
    font-size: 3vw;
  }
  .contact-button {
    font-size: 2vw;
    max-width: 100%;
    margin: 0% auto;
  }
  .subtitle {
    font-size: 4vw;
  }
  .name-text {
    font-size: 3vw;
  }
  .description-text,
  .price-text {
    font-size: 2.5vw;
  }
  .close-button {
    display: none;
  }
}

@media (max-width: 540px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin: 3%;
  }
  .product-image {
    max-width: 100%;
  }
  .main-container {
    padding: 10%;
  }
  .carousel-row {
    margin-top: 0%;
  }
  .product-item1 {
    padding: 5%;
  }
  .product-item2:hover {
    transform: none;
  }
  .main-image {
    display: block;
  }
  .product-image {
    max-width: 100%;
  }
  .product-name {
    font-size: 5vw;
  }
  .product-description,
  .product-price {
    font-size: 4vw;
  }
  .contact-button {
    font-size: 3vw;
  }
  .name-text {
    font-size: 5vw;
  }
  .description-text,
  .price-text {
    font-size: 4vw;
  }
  .close-button {
    display: none;
  }
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    display: inline;
  }
}

@media (max-width: 539px) {
  .exit-icon {
    display: flex;
    font-size: 5vw;
    margin: 3%;
  }
  .title {
    font-size: 8vw;
  }
  .subtitle {
    font-size: 4vw;
  }
  .main-container {
    padding: 0%;
  }
  .product-item1 {
    padding: 0%;
  }
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    max-width: 100%;
    margin-top: 5%;
  }
  .main-image {
    display: block;
  }
  .product-image {
    max-width: 100%;
  }
  .product-name {
    font-size: 8vw;
  }
  .product-description,
  .product-price {
    font-size: 5vw;
  }
  .contact-button {
    font-size: 4vw;
    max-width: 100%;
  }
  .subtitle {
    font-size: 8vw;
  }
  .name-text {
    font-size: 7vw;
  }
  .description-text,
  .price-text {
    font-size: 6vw;
  }
  .close-button {
    display: none;
  }
  .text {
    font-size: 5vw;
  }
}
</style>
