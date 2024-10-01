<template>
  <v-app>
    <v-row class="nav-bar">
      <v-col><v-img class="logo" src="/logo.png"></v-img></v-col>

      <v-col md="9" class="tabs" v-model="currentTab" @change="changeTab">
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
      <v-col class="social-icons">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-icon>mdi-facebook</v-icon>
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-icon>mdi-instagram</v-icon>
        </a>
        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer">
          <v-icon>mdi-whatsapp</v-icon>
        </a>
      </v-col>
    </v-row>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer class="footer">
      <v-row class="align-center">
        <v-col cols="12" md="3" class="justify-center">
          <v-img class="logotipo" src="/logo.png"></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <div class="footer-text">
            <p class="text">Santa Rosa de Osos</p>
            <p class="text">Colombia</p>
            <p class="text">Tel: 310 7683711</p>
            <p class="text">WhatsApp: +57 310 7683711</p>
            <p class="text">Julianmesa123@hotmail.com</p>
          </div>
        </v-col>
      </v-row>
      <v-divider class="custom-divider"></v-divider>

      <p class="footer-botton">
        {{ new Date().getFullYear() }} — Antigüedades Chespirito
      </p>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";

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

const whatsappLink = computed(() => {
  return `https://wa.me/${CONFIG.public.WPP}`;
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
  height: 120px;
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
.text {
  padding: 0.5%;
}
.footer-botton {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  height: 15px;
  margin: 1%;
}
.custom-divider {
  color: white;
  width: 96.5vw;
}
.social-icons {
  display: flex;
  gap: 10px;
}
.social-icons a {
  color: #fff;
  transition: color 0.3s;
}
.social-icons a:hover {
  color: #f5f5f5;
}
</style>
