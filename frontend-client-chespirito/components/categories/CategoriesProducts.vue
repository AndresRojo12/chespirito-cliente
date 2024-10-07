<template>
  <div v-if="category">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
    <div>
      <h1 class="title">{{ category.name }}</h1>
    </div>

    <v-text-field
      class="search-field"
      v-model="search"
      density="comfortable"
      placeholder="Buscar"
      prepend-inner-icon="mdi-magnify"
      variant="plain"
      clearable
      hide-details
      dense
      @click:clear="clearSearch"
    ></v-text-field>

    <div class="product-container">
      <v-card
        :class="{
          'highlighted-card':
            search && product.name.toLowerCase().includes(search.toLowerCase()),
        }"
        class="product-item"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <h1 class="name-text">
          {{ product.name }}
        </h1>
        <div>
          <img class="product-image" :src="getImageUrl(product.imagePath1)" />
        </div>
        <div class="product-info">
          <p class="description-text">Estado {{ product.status }}</p>
          <p class="description-text">{{ product.description }}</p>
          <p class="price-text">{{ formatPrice(product.price) }}</p>
          <v-card-actions>
            <v-btn class="contact-button" @click="goToResult(product.id)"
              >Ver más</v-btn
            >
          </v-card-actions>
        </div>
      </v-card>
      <v-card
        v-if="filteredProducts.length === 0"
        class="no-results-card"
        elevation="3"
      >
        <v-card-text>
          <v-icon large>mdi-alert-circle</v-icon>
          <h2 class="no-results-title">¡No se encontraron productos!</h2>
        </v-card-text>
      </v-card>
    </div>
  </div>

  <v-container v-else>
    <LoadingSpinner />
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const { id } = route.params;
const category = ref(null);
const products = ref([]);
const error = ref(null);
const search = ref("");

const fetchCategory = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories/${id}`
    );
    category.value = data.value;
    products.value = data.value.products || [];
  } catch (err) {
    error.value = err;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchCategory();
});

const filteredProducts = computed(() => {
  if (!search.value.trim()) {
    return products.value;
  }
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  );
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
</script>

<style scoped>
.exit-icon {
  display: none;
}
.title {
  color: #4a4a4a;
  font-family: "Poppins", sans-serif;
  text-align: center;
  font-size: 40px;
  margin: 2%;
}
.search-field {
  background: white;
  max-width: 500px;
  margin-left: 3%;
  height: 52px;
  border: 0.5px solid #d3d3d3;
  padding-inline-start: 1%;
  border-radius: 3px;
  font-family: "Poppins", sans-serif;
}
.product-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: start;
  gap: 1%;
  padding: 2%;
  border-radius: 0.5%;
}
.product-item {
  transition: transform 0.3s ease;
  max-width: 22%;
  height: auto;
  margin: 1%;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(173, 216, 230, 0.1)
  );
}
.product-item {
  transition: transform 0.5s ease, width 0.5s ease, height 0.5s ease;
}
.highlighted-card {
  width: 100vw;
  height: auto;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.no-results-card {
  width: 100%;
  text-align: center;
  padding: 50px;
  margin-top: 20px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(173, 216, 230, 0.1)
  );
}
.no-results-title {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: rgba(0, 0, 0, 0.7);
}
.v-icon {
  margin-bottom: 15px;
  color: rgba(0, 0, 0, 0.7);
}
.product-item:hover {
  transform: scale(1.1);
}
.product-item:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 140, 0.2);
}
.image-container {
  overflow: visible;
  position: relative;
}
.product-image {
  transition: transform 0.3s ease;
  width: 100%;
  padding: 5%;
}
.product-info {
  text-align: center;
}
.name-text {
  font-size: 20px;
  font-family: "Poppins", sans-serif;
  text-align: center;
  margin-top: 10%;
  color: rgba(0, 0, 0, 0.7);
}
.description-text {
  font-size: 14px;
  padding: 0.5%;
  font-family: "Poppins", sans-serif;
}
.price-text {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: bold;
  padding: 5%;
}
.contact-button {
  width: 100%;
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
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin: 2%;
  }
}

@media (max-width: 540px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin: 3%;
  }
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    display: inline;
  }
}
@media (max-width: 430px) {
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
  .product-container {
    display: inline;
    max-width: 100%;
  }
  .product-item {
    max-width: 100%;
    margin-top: 5%;
  }
  .name-text,
  .description-text,
  .price-text {
    font-size: 5vw;
  }
}
</style>
