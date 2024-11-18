<template>
  <v-app>
    <section class="image-container">
      <div class="blurred-background"></div>
      <img :src="imageSrc" alt="Product image " class="random-image" />
      <div class="overlay-text">
        <h2>Compra y venta de billetes y monedas</h2>
      </div>
    </section>

    <section class="search-container">
      <v-text-field
        class="search-field"
        v-model="search"
        density="comfortable"
        placeholder="Busca billetes o monedas"
        prepend-inner-icon="mdi-magnify"
        variant="plain"
        clearable
        hide-details
        dense
        @click:clear="clearSearch"
      ></v-text-field>
      <v-list
        v-if="search.trim() && searchedProducts.data.length"
        class="autocomplete-list"
      >
        <v-list-item
          v-for="product in searchedProducts.data"
          :key="product.id"
          @click="goToResult(product.id)"
        >
          <v-list-item-title>{{ product.name }}</v-list-item-title>
          <h6>{{ product.description }}</h6>
        </v-list-item>
      </v-list>
      <p v-else-if="search.trim() && searchedProducts.data.length === 0">
        No se encontraron productos para "{{ search.trim() }}"
      </p>
    </section>

    <section class="main-carousel">
      <v-carousel
        v-if="randomProducts.length"
        cycle
        :interval="8000"
        transition="fade-transition"
        :show-arrows="false"
        class="carousel"
      >
        <v-carousel-item v-for="item in randomProducts" :key="item.id">
          <div class="carousel-container">
            <img
              class="carousel-image"
              :src="getImageUrl(item.imagePath1)"
              :cols="12"
            />
            <div class="image-overlay">
              <h1 class="category">{{ item.category.name }}</h1>
              <h2 class="product-description">{{ item.name }}</h2>
              <p class="product-description">{{ item.description }}</p>
              <p class="product-description">Estado {{ item.status }}</p>
              <p class="product-price">
                {{ formatPrice(item.price) }}
              </p>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>

      <v-container v-else> <LoadingSpinner /> </v-container>
    </section>

    <v-divider></v-divider>
    <section class="numismatic-section">
      <div class="content-container">
        <h1 class="section-title">
          Bienvenido al lugar ideal para los apasionados de la numismática
        </h1>
        <p class="intro-text">
          El fascinante arte de coleccionar billetes y monedas de diversas
          épocas y lugares. En <strong>Antigüedades Chespirito</strong>, nos
          dedicamos a la compra y venta de billetes y monedas únicos, antiguos y
          modernos, garantizando autenticidad y calidad.
        </p>
        <ul class="highlights-list">
          <li>Billetes raros de diferentes países y épocas.</li>
          <li>Monedas conmemorativas, de curso legal o históricas.</li>
          <li>
            Asesoramiento personalizado para evaluar el valor de tus piezas.
          </li>
        </ul>
        <p class="closing-text">
          Nos especializamos en atender tanto a coleccionistas expertos como a
          quienes están comenzando su travesía en el mundo de la numismática.
          ¡Explora, compra o vende con confianza y da vida a tu pasión por la
          numismática!
        </p>
      </div>
    </section>
    <v-divider></v-divider>
    <h1 class="subtitle">De tu interés</h1>
    <section>
      <v-carousel
        height="auto"
        hide-delimiters
        v-model="currentCardIndex"
        @change="handleCardChange"
      >
        <v-carousel-item
          v-for="index in Math.ceil(limitedProducts.length / itemsPerRow)"
          :key="index"
        >
          <v-row class="carousel-row">
            <v-col
              v-for="product in limitedProducts.slice(
                (index - 1) * itemsPerRow,
                index * itemsPerRow
              )"
              :key="product.id"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
            >
              <v-card class="product-item">
                <h6 class="name-text">{{ product.name }}</h6>

                <div>
                  <img
                    class="product-image"
                    :src="getImageUrl(product.imagePath1)"
                  />
                  <p class="description-text">{{ product.description }}</p>
                  <p class="price-text">{{ formatPrice(product.price) }}</p>
                </div>
                <v-card-actions>
                  <v-btn class="details-button" @click="goToResult(product.id)">
                    Ver más
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </section>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { debounce } from "lodash";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();
const { width } = useDisplay();

const page = ref(1);
const pageSize = ref(10);
const products = ref([]);
const filteredProducts = ref({ data: [], totalPages: 1 });
const searchedProducts = ref({ data: [], totalPages: 1 });
const search = ref("");
const currentCardIndex = ref(0);
const randomProducts = ref([]);
const imageSrc = ref("");

const getProducts = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}products?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      }
    );
    products.value = data.value.data;
    filteredProducts.value = {
      data: data.value.data,
      totalPages: data.value.totalPages,
    };
    randomProducts.value = shuffleArray(products.value).slice(0, 5);
    const randomProduct =
      randomProducts.value[
        Math.floor(Math.random() * randomProducts.value.length)
      ];
    const randomImage = randomProduct.imagePath1;
    imageSrc.value = randomImage;
  } catch (error) {
    products.value = [];
    filteredProducts.value = { data: [], totalPages: 1 };
  }
};

watch([page, pageSize], async () => {
  await getProducts();
});

const fetchSearchedProducts = debounce(async (newSearch) => {
  if (!newSearch.trim()) {
    searchedProducts.value = {
      data: products.value,
      totalPages: 1,
    };
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.public.API_BASE_URL}products/search?query=${encodeURIComponent(
        newSearch.trim()
      )}`
    );
    const data = await response.json();

    if (data.length === 0) {
      searchedProducts.value = { data: [], totalPages: 1 };
    } else {
      searchedProducts.value = { data, totalPages: 1 };
    }
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    searchedProducts.value = { data: [], totalPages: 1 };
  }
}, 300);

watch(search, (newSearch) => {
  fetchSearchedProducts(newSearch);
});

onMounted(async () => {
  await nextTick();
  await getProducts();
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

const limitedProducts = computed(() => {
  return products.value.slice(0, 8);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

const goToResult = (item) => {
  router.push(`/products/${item}`);
};

const clearSearch = () => {
  search.value = "";
  searchedProducts.value = { data: [] };
};

const handleCardChange = (newIndex) => {
  if (newIndex >= filteredProducts.value.length) {
    currentCardIndex.value = filteredProducts.value.length - 1;
  } else {
    currentCardIndex.value = newIndex;
  }
};

function shuffleArray(array) {
  return Array.isArray(array) ? array.sort(() => Math.random() - 0.5) : [];
}
</script>

<style>
.image-container {
  position: relative;
  width: 100%;
  height: 300px;
  margin: 1% auto;
}
.random-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.blurred-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  font-size: 2rem;
  font-family: "Poppins", sans-serif;
}
.search-container {
  position: relative;
}
.search-field {
  background: white;
  max-width: 100%;
  margin: 1%;
  height: 52px;
  border: 0.5px solid #d3d3d3;
  padding-inline-start: 1%;
  border-radius: 3px;
  font-family: "Poppins", sans-serif;
}
.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-height: 300px;
}
.v-list-item {
  padding: 10px 15px;
  transition: background-color 0.3s ease;
}
.v-list-item:hover {
  background: linear-gradient(to bottom, #f7f7f7, #eaeaea);
  cursor: pointer;
}
.v-list-item-title {
  font-weight: bold;
  font-family: "Poppins", sans-serif;
}
.v-list-item h6 {
  color: #666;
  margin: 1px 2px 0;
  font-family: "Poppins", sans-serif;
}
.main-carousel {
  padding-bottom: 2rem;
}
.carousel-container {
  justify-content: space-evenly;
  display: flex;
}
.carousel-image {
  max-width: 650px;
  max-height: 350px;
  overflow: hidden;
  margin: 5%;
  border-radius: 3px;
}
.image-overlay {
  font-family: "Poppins", sans-serif;
  color: "#333333";
  text-align: center;
  margin-top: 5.5%;
  margin-right: 10%;
}
.product-description {
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  padding: 2px;
}
.product-price {
  font-size: 16px;
  padding: 3px;
  font-weight: bold;
}
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
.subtitle {
  text-align: center;
  font-size: 2rem;
  color: #222222;
  font-family: "Poppins", sans-serif;
  margin-top: 4%;
}
.carousel-row {
  margin-top: 1%;
  padding: 23px;
}
.product-item {
  transition: transform 0.3s ease, z-index 0.3s ease;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1%;
  max-height: 100%;
}
.product-item:hover {
  transform: scale(1.1);
}
.name-text {
  font-size: 20px;
  margin-top: 15%;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: "#333333";
}
.product-image {
  padding: 5%;
  width: 100%;
  height: 100%;
}
.category {
  border-radius: 2px;
  font-size: 2rem;
  color: "#333333";
  text-align: center;
  font-family: "Poppins", sans-serif;
  margin-bottom: 3%;
  width: 300px;
}
.description-text {
  font-size: 16px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: "#333333";
}
.price-text {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: "#333333";
}
.details-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  border: none;
}
.v-carousel__controls {
  background-color: transparent !important;
  color: rgba(0, 0, 0, 0.6) !important;
}
.numismatic-section {
  background: linear-gradient(
    to left,
    rgba(0, 156, 140, 00.5),
    rgba(0, 156, 140, 0.9)
  );
  color: white;
  padding: 3rem 1rem;
  text-align: center;
}
.content-container {
  max-width: 800px;
  margin: 0 auto;
}
.section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
  color: white;
}
.intro-text {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}
.highlights-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  font-family: "Poppins", sans-serif;
}
.highlights-list li {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
}
.closing-text {
  font-size: 1rem;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
}

@media (min-width: 541px) and (max-width: 960px) {
  .search-field {
    max-width: 100%;
  }
  .subtitle {
    font-size: 5vw;
  }
  .carousel-container {
    display: flex;
  }
  .carousel-image {
    max-width: 60%;
    max-height: 60%;
    margin: 8% auto;
  }
  .image-overlay {
    margin: 8% auto;
    margin-right: 5%;
  }
  .product-item:hover {
    transform: none;
  }
  .category {
    max-width: 100%;
    width: 215px;
  }
}

@media (max-width: 540px) {
  .search-field {
    max-width: 100%;
  }
  .subtitle {
    font-size: 6vw;
  }
  .carousel {
    text-align: center;
  }
  .carousel-container {
    display: block;
  }
  .carousel-image {
    max-height: 100%;
    max-width: 100%;
    margin: 0% auto;
  }
  .image-overlay {
    margin: 0% auto;
  }
  .carousel-row {
    margin-top: 0%;
    padding: 0px;
  }
  .product-item:hover {
    transform: none;
  }
  .category {
    max-width: 100%;
    width: 600px;
  }
}

@media (max-width: 539px) {
  .search-field {
    max-width: 100%;
  }
  .subtitle {
    font-size: 9vw;
  }
  .main-carousel {
    text-align: center;
  }
  .carousel-container {
    display: block;
  }
  .carousel-image {
    max-width: 100%;
    max-height: 100%;
  }
  .image-overlay {
    margin: 0% auto;
  }
  .product-description,
  .product-price {
    font-size: 5vw;
  }
  .product-item:hover {
    transform: none;
  }
  .name-text {
    font-size: 8vw;
  }
  .description-text,
  .price-text {
    font-size: 5vw;
  }
  .details-button {
    font-size: 4vw;
  }
  .category {
    font-size: 7vw;
    max-width: 100%;
    margin: 0% auto;
    width: 400px;
    margin-bottom: 5%;
  }
  .image-container {
    width: 100%;
  }
  .overlay-text {
    font-size: 3vh;
  }
}
</style>
