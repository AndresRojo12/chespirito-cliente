<template>
  <v-app>
    <v-row class="nav-bar">
      <v-img class="logo" src="/logo.png"></v-img>

      <v-col md="10" class="tabs" v-model="currentTab" @change="changeTab">
        <v-tab
          to="/"
          :class="{ 'active-tab': currentTab === '/' }"
          @click="currentTab = '/'"
        >
          Inicio
        </v-tab>
        <v-tab
          to="/products"
          :class="{ 'active-tab': currentTab === '/products' }"
          >Billetes</v-tab
        >
        <v-tab to="/coins" :class="{ 'active-tab': currentTab === '/coins' }"
          >Monedas</v-tab
        >
      </v-col>
    </v-row>

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
    <v-main>
      <v-container>
        <div class="category-container">
          <div
            class="category-item"
            v-for="cate in filteredCategories.data || []"
            :key="cate.id"
          >
            <nuxt-link :to="`/categories/${cate.id}`">
              <div>
                <img
                  class="category-image"
                  :src="getImageUrl(cate.imagePath)"
                />
              </div>

              <button class="category-info">
                <p>{{ cate.name }}</p>
                <p style="font-size: 13px">{{ cate.description }}</p>
              </button>
            </nuxt-link>
          </div>
        </div>

        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                    v-model="page"
                    :length="filteredCategories.totalPages || 1"
                    class="my-4"
                    @input="getCategories"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
    </v-main>
    <v-container fluid class="p-0 m-0"
      ><v-divider class="custom-divider"></v-divider
    ></v-container>

    <v-main>
      <v-container>
        <h1>Billetes</h1>
        <div class="category-container">
          <div
            class="category-item"
            v-for="cate in filteredCategories.data || []"
            :key="cate.id"
          >
            <nuxt-link :to="`/categories/${cate.id}`">
              <div>
                <img
                  class="category-image"
                  :src="getImageUrl(cate.imagePath)"
                />
              </div>

              <button class="category-info">
                <p>{{ cate.name }}</p>
                <p style="font-size: 13px">{{ cate.description }}</p>
              </button>
            </nuxt-link>
          </div>
        </div>

        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                    v-model="page"
                    :length="filteredCategories.totalPages || 1"
                    class="my-4"
                    @input="getCategories"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
    </v-main>
    <v-container fluid class="p-0 m-0"
      ><v-divider class="custom-divider"></v-divider
    ></v-container>
    <v-main>
      <v-container>
        <h1>Monedas</h1>
        <div class="category-container">
          <div
            class="category-item"
            v-for="cate in filteredCategories.data || []"
            :key="cate.id"
          >
            <nuxt-link :to="`/categories/${cate.id}`">
              <div>
                <img
                  class="category-image"
                  :src="getImageUrl(cate.imagePath)"
                />
              </div>

              <button class="category-info">
                <p>{{ cate.name }}</p>
                <p style="font-size: 13px">{{ cate.description }}</p>
              </button>
            </nuxt-link>
          </div>
        </div>

        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                    v-model="page"
                    :length="filteredCategories.totalPages || 1"
                    class="my-4"
                    @input="getCategories"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
    </v-main>
    <v-footer class="footer">
      <v-container fluid
        ><v-row class="justify-center align-center">
          <v-col cols="12" md="3" class="justify-center">
            <v-img class="logotipo" src="/logo.png"></v-img>
          </v-col>
          <v-col cols="12" md="8">
            <div class="footer-text">
              <p>Dirección</p>
              <p>Calle 123, Ciudad</p>
              <p>País</p>
              <p>Contacto</p>
              <p>Tel: +123 456 789</p>
              <p>Email: contacto@ejemplo.com</p>
            </div>
          </v-col>
        </v-row>
        <v-container fluid
          ><v-divider style="color: white; width: 100vw"></v-divider
        ></v-container>

        <p class="footer-botton">
          {{ new Date().getFullYear() }} — Antigüedades Chespirito
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

const CONFIG = useRuntimeConfig();

const page = ref(1);
const pageSize = ref(10);
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const search = ref("");
const currentTab = ref("/");

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
  await getCategories();
});

watch(search, async (newSearch) => {
  if (!newSearch.trim()) {
    filteredCategories.value = {
      data: categories.value,
      totalPages: filteredCategories.value.totalPages,
    };
    return;
  }

  try {
    const response = await fetch(
      `${
        CONFIG.public.API_BASE_URL
      }categories/search?query=${encodeURIComponent(newSearch.trim())}`
    );
    const data = await response.json();
    filteredCategories.value = { data, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching filtered categories:", error);
    filteredCategories.value = { data: [], totalPages: 1 };
  }
});

watch(page, async () => {
  await getCategories();
});

watch(pageSize, async () => {
  await getCategories();
});
</script>

<style scoped>
.nav-bar {
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  display: flex;
  align-items: center;
  height: 130px;
}
.logo {
  max-height: 170px;
  height: 170%;
}
.tabs {
  color: white;
  font-family: "Poppins", sans-serif;
}
.active-tab {
  color: white;
  font-weight: bold;
}
.custom-divider {
  width: 100vw;
}
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
.category-image {
  width: 100%;
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
  cursor: pointer;
}
.dialog {
  max-width: 500px;
}
.dialog-title {
  align-self: center;
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 10px;
  font-family: "Arial", sans-serif;
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
