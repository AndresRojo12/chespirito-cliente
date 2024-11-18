<template>
  <v-app>
    <v-row class="nav-bar">
      <v-col v-if="!isMdAndUp" class="menu-button">
        <v-icon class="menu-button" @click="drawer = !drawer">mdi-menu</v-icon>
      </v-col>
      <v-col><v-img class="logo" src="/logo.png"></v-img></v-col>

      <v-col md="9" class="tabs" v-if="isMdAndUp">
        <v-taps v-model="currentTab" @change="changeTab"
          ><v-tab :class="{ 'active-tab': currentTab === '/' }" :to="'/'"
            >Inicio</v-tab
          >
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
          v-for="icon in icons"
          :key="icon.name"
          :href="icon.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-icon>{{ icon.name }}</v-icon>
        </a>
      </v-col>
    </v-row>

    <v-navigation-drawer v-model="drawer" app temporary width="200">
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
      <div style="display: flex">
        <v-img class="logotipo" src="/logo.png" max-width="300"></v-img>
        <div class="footer-text">
          <p class="text">Santa Rosa de Osos</p>
          <p class="text">Colombia</p>
          <p class="text">Tel: 310 7683711</p>
          <p class="text">WhatsApp: +57 310 7683711</p>
          <p class="text">Julianmesa123@hotmail.com</p>
        </div>
      </div>
      <v-divider class="custom-divider"></v-divider>
      <div class="footer-bottom">
        <p>{{ new Date().getFullYear() }} — Antigüedades Chespirito</p>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

const CONFIG = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const { mdAndUp } = useDisplay();

const page = ref(1);
const pageSize = ref(10);
const categories = ref([]);
const filteredCategories = ref({ data: [], totalPages: 1 });
const currentTab = ref(route.path);
const drawer = ref(false);
const isMdAndUp = mdAndUp;

const icons = ref([
  { name: "mdi-facebook", url: CONFIG.public.FACEBOOK },
  {
    name: "mdi-whatsapp",
    url: computed(() => `https://wa.me/${CONFIG.public.WPP}`),
  },
]);

watch(
  () => route.path,
  (newPath) => {
    currentTab.value = newPath;
  }
);

const changeTab = (newTab) => {
  if (currentTab.value !== newTab) {
    currentTab.value = newTab;
    router.push(newTab); 
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

onMounted(async () => {
  await nextTick();
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
  height: 120px;
}
.menu-button {
  color: white;
  display: flex;
  align-items: center;
  margin: 4%;
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
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
  color: white;
  padding: 27px 30px;
  height: auto;
  clip-path: polygon(0 0, 88% 0, 100% 100%, 11% 100%);
  transition: all 0.3s ease;
}
.footer {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.9)
  );
  display: block;
}
.logotipo {
  max-width: 100%;
  height: auto;
}
.footer-text {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  font-size: 1.1rem;
  margin-top: 6%;
}
.text {
  padding: 0.5%;
}
.footer-bottom {
  font-family: "Poppins", sans-serif;
  color: #d3d3d3;
  font-size: 1rem;
  height: 40px;
  text-align: center;
  margin-top: 1%;
}
.custom-divider {
  color: #d3d3d3;
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
  color: black;
}
.v-navigation-drawer {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.drawer-text {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.v-list-item-title {
  font-size: 1.2em;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.v-list-item {
  padding: 15px;
}

@media (min-width: 601px) and (max-width: 960px) {
  .nav-bar {
    height: 100px;
  }
  .social-icons {
    justify-content: end;
    margin-right: 2%;
  }
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

@media (max-width: 540px) {
  .nav-bar {
    height: 100px;
  }
  .logo {
    display: none;
  }
  .social-icons {
    justify-content: end;
    margin-right: 2%;
  }
  .footer-text {
    font-size: 3vw;
    margin-top: 10%;
    margin-right: 10%;
  }
  .logotipo {
    max-width: 80%;
  }
}

@media (max-width: 539px) {
  .tabs {
    display: none;
  }
  .logo {
    display: none;
  }
  .nav-bar {
    height: 20vw;
  }
  .menu-button {
    font-size: 8vw;
  }
  .social-icons {
    margin-right: 2%;
    font-size: 5vw;
  }
  .footer-text p {
    font-size: 4vw;
    max-width: 100%;
  }
  .custom-divider {
    margin-top: 5%;
  }
  .footer-bottom {
    font-size: 4vw;
    margin-top: 5%;
  }
  .logotipo {
    max-width: 100%;
    margin: 0% auto;
  }
}
</style>
