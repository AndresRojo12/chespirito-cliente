<template>
  <v-app>
    <v-row class="nav-bar">
      <v-col v-if="!isMdAndUp" class="menu-button">
        <v-icon class="menu-button" @click="drawer = !drawer">mdi-menu</v-icon>
      </v-col>
      <v-col><v-img class="logo" src="/logo.png"></v-img></v-col>

      <v-col md="9" class="tabs" v-if="isMdAndUp">
        <v-taps v-model="currentTab" @change="changeTab"
          ><v-tab :to="'/'">Inicio</v-tab>
          <v-tab
            v-for="cate in filteredCategories.data || []"
            :key="cate.id"
            :to="`/categories/${cate.id}`"
            :class="{ 'active-tab': currentTab === `/categories/${cate.id}` }"
          >
            {{ cate.name }}
          </v-tab></v-taps
        >
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

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item :to="'/'">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="cate in filteredCategories.data || []"
          :key="cate.id"
          :to="`/categories/${cate.id}`"
        >
          <v-list-item-icon>
            <v-icon>mdi-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ cate.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer class="footer" padless>
      <v-img class="logotipo" src="/logo.png" max-width="300"></v-img>
      <div class="footer-text">
        <p class="text">Santa Rosa de Osos</p>
        <p class="text">Colombia</p>
        <p class="text">Tel: 310 7683711</p>
        <p class="text">WhatsApp: +57 310 7683711</p>
        <p class="text">Julianmesa123@hotmail.com</p>
      </div>
    </v-footer>
    <v-div class="custom-divider"></v-div>
    <div class="footer-bottom">
      <p>{{ new Date().getFullYear() }} — Antigüedades Chespirito</p>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useDisplay } from "vuetify";

const CONFIG = useRuntimeConfig();
const { mdAndUp } = useDisplay();

const page = ref(1);
const pageSize = ref(10);
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const currentTab = ref("/");
const drawer = ref(false);
const isMdAndUp = mdAndUp;

const changeTab = (newTab) => {
  currentTab.value = newTab;
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
.menu-button {
  color: white;
  display: flex;
  align-items: center;
  margin-left: 4%;
}
.logo {
  width: 100%;
  max-width: 150px;
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
}
.logotipo {
  max-width: 100%;
  height: auto;
}
.footer-text {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  font-size: 1.1rem;
}
.text {
  padding: 0.5%;
}
.footer-bottom {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  font-size: 1rem;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.9)
  );
  margin-bottom: 5px;
  height: 40px;
  text-align: center;
}
.custom-divider {
  background-color: #4a4a4a;
  height: 1px;
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
  color: black;
}
.v-navigation-drawer {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.v-list-item-title {
  font-size: 1.2em;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
}
.v-list-item {
  padding: 15px;
}

@media (max-width: 600px) {
  .footer {
    display: block;
  }
  .footer-text p {
    font-size: 5vw;
  }
  .footer-bottom {
    font-size: 5vw;
    margin-bottom: 1%;
  }
  .tabs {
    display: none;
  }
  .logo {
    display: none;
  }
  .logotipo {
    max-width: 100%;
    margin: 0% auto;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .footer-text p {
    font-size: 1rem;
  }
  .footer-bottom {
    font-size: 0.9rem;
  }
  .tabs {
    display: none;
  }
  .logo {
    display: none;
  }
}
</style>
