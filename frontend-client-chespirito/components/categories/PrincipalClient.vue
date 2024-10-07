<template>
  <v-app>
    <div class="main-container">
      <div class="search-container">
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
      </div>

      <v-carousel
        v-if="randomProducts.length"
        cycle
        :interval="8000"
        transition="fade-transition"
        hide-delimiters
      >
        <v-carousel-item v-for="item in randomProducts" :key="item.id">
          <div class="carousel-item">
            <h1 class="carousel-title">
              {{ item.category.name }}
            </h1>

            <div class="carousel-container">
              <img class="carousel-image" :src="getImageUrl(item.imagePath1)" />
              <div class="image-overlay">
                <h2 class="product-name">{{ item.name }}</h2>
                <p class="product-description">{{ item.description }}</p>
                <p class="product-description">Estado {{ item.status }}</p>
                <p class="product-price">
                  {{ formatPrice(item.price) }}
                </p>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>

      <v-container v-else>
        <LoadingSpinner />
      </v-container>
    </div>

    <v-divider class="custom-divider"></v-divider>

    <div class="main-container">
      <h1 class="subtitle">De tu interés</h1>
      <v-container fluid>
        <v-carousel
          style="height: auto"
          hide-delimiters
          v-model="currentCardIndex"
          @change="handleCardChange"
        >
          <v-carousel-item
            v-for="index in Math.ceil(Math.min(products.length, 8) / 4)"
            :key="index"
          >
            <v-row>
              <v-col
                style="padding: 2.3%"
                class="carousel-container-2"
                v-for="product in products.slice((index - 1) * 4, index * 4)"
                :key="product.id"
                cols="12"
                md="3"
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
                    <v-btn
                      class="details-button"
                      @click="goToResult(product.id)"
                    >
                      Ver más
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { debounce } from "lodash";
import { useRouter } from "vue-router";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const router = useRouter();

const page = ref(1);
const pageSize = ref(10);
const products = ref([]);
const filteredProducts = ref({ data: [], totalPages: 1 });
const searchedProducts = ref({ data: [], totalPages: 1 });
const search = ref("");
const currentCardIndex = ref(0);

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
  } catch (error) {
    console.error("Error fetching products:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
  }
};

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

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await nextTick();
  await getProducts();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
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

const randomProducts = computed(() => {
  return shuffleArray(filteredProducts.value.data).slice(0, 5);
});
</script>

<style scoped>
.main-container {
  padding: 1%;
}
.search-container {
  position: relative;
}
.search-field {
  background: white;
  max-width: 500px;
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
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-height: 300px;
  overflow-y: auto;
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
.carousel-item {
  display: block;
  padding: 2%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(0, 183, 162, 0.05)
  );
  border-radius: 1%;
}
.carousel-title {
  margin-left: 30%;
  font-family: "Poppins", sans-serif;
  padding: 1%;
  color: rgba(0, 0, 0, 0.7);
}
.carousel-container {
  display: flex;
  align-items: center;
  margin-left: 10%;
}
.carousel-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55%;
}
.image-overlay {
  top: 19%;
  right: 0;
  position: absolute;
  color: rgba(0, 0, 0, 0.7);
  width: 39%;
}
.product-name {
  font-size: 24px;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  padding: 3px;
  color: rgba(0, 0, 0, 0.7);
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
.custom-divider {
  width: 94.7vw;
  margin: 1%;
}
.subtitle {
  text-align: center;
  font-size: 30px;
  padding: 1%;
  font-family: "Poppins", sans-serif;
  color: rgba(0, 0, 0, 0.7);
}
.carousel-container-2 {
  transition: transform 0.3s ease;
}
.carousel-container-2:hover {
  transform: scale(1.1);
}
.product-item {
  transition: transform 0.3s ease;
  max-width: 100%;
  height: auto;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(173, 216, 230, 0.1)
  );
  border-radius: 1%;
}
.name-text {
  font-size: 20px;
  margin-top: 15%;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: rgba(0, 0, 0, 0.7);
}
.product-image {
  width: 100%;
  padding: 5%;
}
.description-text {
  font-size: 16px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #4a4a4a;
}
.price-text {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: bold;
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

@media (max-width: 1024px) {
}

@media (max-width: 540px) {
  .search-field {
    max-width: 100%;
    margin-top: 3%;
  }
  .category-item {
    flex: 1 1 80%;
    max-width: 100%;
  }
}

@media (max-width: 430px) {
  .search-field {
    max-width: 100%;
  }
  .category-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
