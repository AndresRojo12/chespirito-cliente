<template>
  <v-app>
    <v-container
      ><v-text-field
        class="search-field"
        v-model="search"
        density="comfortable"
        placeholder="Busca billetes o monedas"
        prepend-inner-icon="mdi-magnify"
        variant="plain"
        clearable
        hide-details
        dense
      ></v-text-field
    ></v-container>
    <v-main max-height="300">
      <v-container style="height: 100%">
        <v-carousel
          style="height: 100%; width: 100%"
          v-if="filteredProducts.data.length"
          cycle
          :interval="6000"
          transition="fade-transition"
          hide-delimiters
        >
          <v-carousel-item v-for="item in filteredProducts.data" :key="item.id">
            <div class="image-container">
              <img class="category-image" :src="getImageUrl(item.imagePath)" />
              <div class="image-overlay">
                <h2 class="category-name">{{ item.name }}</h2>
                <p class="category-description">{{ item.description }}</p>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>

        <v-container v-else>
          <LoadingSpinner />
        </v-container>
      </v-container>
    </v-main>
    <v-container fluid class="p-0 m-0"
      ><v-divider class="custom-divider"></v-divider
    ></v-container>

    <v-main>
      <v-container>
        <h1>De tu interes</h1>
        <div class="category-container">
          <div
            class="category-item"
            v-for="item in filteredCategories.data || []"
            :key="item.id"
          >
            <nuxt-link :to="`/categories/${item.id}`">
              <div>
                <img
                  class="category-image"
                  :src="getImageUrl(item.imagePath)"
                />
              </div>

              <button class="category-info">
                <p>{{ item.name }}</p>
                <p style="font-size: 13px">{{ item.description }}</p>
              </button>
            </nuxt-link>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

import LoadingSpinner from "../LoadingSpinner.vue";

const CONFIG = useRuntimeConfig();

const page = ref(1);
const pageSize = ref(10);
const products = ref([]);
const filteredProducts = ref({ data: [], totalPages: 1 });
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const search = ref("");

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

const getCategories = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}categories?page=${page.value}&pageSize=${pageSize.value}`,
      {
        method: "GET",
      }
    );
    categories.value = data.value.data;
    filteredCategories.value = data.value;
  } catch (error) {
    console.error("Error fetching categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

onMounted(async () => {
  await nextTick();
  await getProducts();
  await getCategories();
});

watch(search, async (newSearch) => {
  if (!newSearch.trim()) {
    filteredProducts.value = {
      data: products.value,
      totalPages: filteredProducts.value.totalPages,
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
    filteredProducts.value = { data, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    filteredProducts.value = { data: [], totalPages: 1 };
  }
});

watch(page, async () => {
  await getProducts();
  await getCategories();
});

watch(pageSize, async () => {
  await getProducts();
  await getCategories();
});
</script>

<style scoped>
.search-field {
  background: white;
  max-width: 400px;
  margin-top: 1%;
  margin-bottom: 1%;
  height: 52px;
  border: 0.5px solid #d3d3d3;
  padding-inline-start: 1%;
  border-radius: 0px;
  font-family: "Poppins", sans-serif;
}
.custom-divider {
  width: 100vw;
}
.category-container {
  display: flex;
  flex-wrap: wrap;
}
.category-item {
  flex: 1 1 22%;
  max-width: 22%;
  margin: 2%;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.image-container {
  width: 100%;
  height: 100%;
}
.category-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  padding: 20px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.image-container:hover .image-overlay {
  opacity: 1;
}
.category-name {
  font-size: 18px;
  font-weight: bold;
}
.category-description {
  font-size: 14px;
}
.category-info {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: linear-gradient(
    to bottom,
    rgba(48, 55, 55, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  border: none;
}
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
.footer {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.9)
  );
  display: block;
  margin-bottom: 0.4%;
}
.logotipo {
  transform: scale(1.3);
  transition: transform 0.3s;
}
.footer-text {
  margin-bottom: 3%;
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
}
.footer-botton {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  height: 15px;
  margin-left: 7%;
  margin-top: 2%;
}

@media (max-width: 1024px) {
  .dialog {
    margin-bottom: 40%;
  }
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
  .dialog {
    margin-bottom: 0%;
  }
  .dialog-title {
    font-size: 6vw;
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
  .dialog {
    margin-bottom: 0%;
  }
  .dialog-title {
    margin-top: 5%;
    font-size: 6vw;
  }
  .cancel-button {
    width: 100%;
    font-size: 4vw;
    margin-bottom: 5%;
  }
}
</style>
