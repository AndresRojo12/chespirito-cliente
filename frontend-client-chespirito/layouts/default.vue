<template>
  <v-app>
    <v-row class="nav-bar">
      <v-img class="logo" src="/logo.png"></v-img>

      <v-col md="10" class="tabs" v-model="currentTab" @change="changeTab">
        <v-tab :to="'/'">Inicio</v-tab>
        <v-tab
          v-for="cate in filteredCategories.data || []"
          :key="cate.id"
          :to="`/categories/${cate.id}`"
          :class="{ 'active-tab': currentTab === `/categories/${cate.id}` }"
        >
          {{ cate.name }}
        </v-tab>
      </v-col>
    </v-row>

    <v-main>
      <v-container fluid>
        <slot />
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

onMounted(async () => {
  await nextTick();
  await getCategories();
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
</style>
