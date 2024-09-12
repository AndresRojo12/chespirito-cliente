<template>
  <div>
    <h1 style="display: flex; justify-content:center ;">Antigüedades Chespirito</h1>
  </div>
  <div style="margin-top:4% ;" class="header-container">
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
  </div>

  <div style="margin-top:4% ;" class="category-container">
    <div
      class="category-item"
      v-for="cate in filteredCategories.data || []"
      :key="cate.id"
    >
      <div>
        <img class="category-image" :src="getImageUrl(cate.imagePath)" />
      </div>
      <nuxt-link :to="`/categories/${cate.id}`">
        <button class="category-info">
          <h3>{{ cate.name }}</h3>
          <p>{{ cate.description }}</p>
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
</template>

<script setup>
import { useRouter } from "vue-router";
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
      },
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
      `${CONFIG.public.API_BASE_URL}categories/search?query=${encodeURIComponent(newSearch.trim())}`,
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
.header-container {
  display: flex;
  justify-content: space-between;
}
.register-button {
  color: white;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  font-family: "Arial", sans-serif;
}
.search-field {
  max-width: 300px;
}
.page-select {
  max-width: 300px;
  margin-top: 2%;
}
.category-container {
  display: flex;
  flex-wrap: wrap;
}
.category-item {
  flex: 1 1 22%;
  max-width: 22%;
  margin: 1%;
  box-sizing: border-box;
  text-align: center;
}
.category-image {
  width: 100%;
}
.category-info {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
  border: none;
  border-radius: 5px;
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
.cancel-button {
  background-image: linear-gradient(to bottom, #009c8c, #00b7a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial", sans-serif;
}

@media (max-width: 1024px) {
  .dialog {
    margin-bottom: 40%;
  }
}

@media (max-width: 540px) {
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 4vw;
  }
  .search-field {
    max-width: 100%;
    margin-top: 3%;
  }
  .page-select {
    max-width: 100%;
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
  .header-container {
    display: inline;
  }
  .register-button {
    width: 100%;
    font-size: 5vw;
  }
  .search-field {
    max-width: 100%;
  }
  .page-select {
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
