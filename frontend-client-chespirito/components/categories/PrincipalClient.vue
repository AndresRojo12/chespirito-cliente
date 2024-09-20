<template>
  <v-app
    ><card app class="nav-bar">
      <p class="nav-bar-title">Antigüedades Chespirito</p>
      <v-text-field
        class="search-field"
        v-model="search"
        density="comfortable"
        placeholder="Buscar categorías"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        clearable
        hide-details
      ></v-text-field>
    </card>
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
  </v-app>
  <footer class="footer">
    <v-container>
      <v-row>
        <v-col></v-col>
        <v-col cols="12" md="4">
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
    </v-container>

    <v-divider style="color: white"></v-divider>

    <p class="footer-botton">
      {{ new Date().getFullYear() }} — Antigüedades Chespirito
    </p>
  </footer>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

const CONFIG = useRuntimeConfig();

const page = ref(1);
const pageSize = ref(10);
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const search = ref("");

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
  display: flex;
  justify-content: space-between;
  max-height: 15%;
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
}
.nav-bar-title {
  margin: 2%;
  font-family: "Poppins", sans-serif;
  color: #ffffff;
}
.search-field {
  max-width: 400px;
  margin: 1%;
  border: #009c8c;
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
    rgba(0, 156, 140, 0.8),
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
  height: 240px;
}
.footer-text {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
}
.footer-botton {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  height: 20px;
  margin-left: 5%;
  margin-top: 1.5%;
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
