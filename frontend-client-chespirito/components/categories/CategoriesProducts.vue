<template>
  <div v-if="category">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
    <div>
      <h1 class="title">{{ category.name }}</h1>
    </div>
    <div class="search-container">
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
        @input="fetchSearchedProducts(search)"
      ></v-text-field
      ><v-list
        v-if="search.trim() && filteredProducts.length"
        class="autocomplete-list"
      >
        <v-list-item
          v-for="product in filteredProducts"
          :key="product.id"
          @click="selectProduct(product)"
        >
          <v-list-item-title>{{ product.name }}</v-list-item-title>
          <h6>{{ category.name }}</h6>
        </v-list-item>
      </v-list>

      <p v-else-if="search.trim() && filteredProducts.length === 0">
        No se encontraron productos para "{{ search.trim() }}"
      </p>
    </div>

    <div class="product-container">
      <div
        class="product-item"
        v-for="product in products || []"
        :key="product.id"
      >
        <div>
          <img class="product-image" :src="getImageUrl(product.imagePath1)" />
        </div>
        <div class="product-info">
          <h1 class="name-text">
            {{ product.name }}
          </h1>
          <p class="description-text">Estado {{ product.status }}</p>
          <p class="description-text">{{ product.description }}</p>
          <p class="price-text">{{ formatPrice(product.price) }}</p>
          <v-card-actions>
          <v-btn class="open-dialog-button" @click="openDialog(product)"
            >Ver más...</v-btn
          >
        </v-card-actions>
        </div>
      </div>
    </div>
    <v-dialog class="dialog" v-model="showDialog">
      <v-card>
        <v-icon @click="showDialog = false" class="close-icon">
          mdi-close
        </v-icon>
        <div style="display: inline-flex">
          <v-img
            class="dialog-image"
            :src="selectedProduct?.imagePath1"
          ></v-img>
          <div style="margin-right: 5%">
            <v-card-title
              ><h5 class="dialog-name">
                {{ selectedProduct?.name }}
              </h5></v-card-title
            >
            <v-card-subtitle
              ><p class="dialog-status">
                Estado {{ selectedProduct?.status }}
              </p></v-card-subtitle
            >
            <v-card-subtitle
              ><p class="dialog-description">
                {{ selectedProduct?.description }}
              </p></v-card-subtitle
            >
            <v-card-subtitle
              ><h5 class="dialog-price">
                {{ formatPrice(selectedProduct?.price) }}
              </h5></v-card-subtitle
            >

            <v-card-actions>
              <v-btn
                class="contact-button"
                :href="generateWhatsappLink(selectedProduct)"
                >Contactar al vendedor</v-btn
              >
            </v-card-actions>
          </div>
        </div>
      </v-card>
    </v-dialog>
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
const showDialog = ref(false);
const selectedProduct = ref(null);
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

const filteredProducts = computed(() => {
  if (!search.value.trim()) {
    return products.value;
  }
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(async () => {
  await nextTick();
  await fetchCategory();
});

const generateWhatsappLink = (product) => {
  const message = `Hola, me interesa este producto.\nNombre: ${
    product.name
  }\nDescripción: ${product.description}\nPrecio: ${
    product.price
  }\nImagen: ${getImageUrl(
    product.imagePath
  )}\n¿Me podrías dar más información?`;
  return `https://wa.me/${CONFIG.public.WPP}?text=${encodeURIComponent(
    message
  )}`;
};

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

const selectProduct = (product) => {
  selectedProduct.value = product;
};

const openDialog = (product) => {
  selectedProduct.value = product;
  showDialog.value = true;
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
  margin-top: 1%;
  font-size: 48px;
}
.search-container {
  position: relative;
}
.search-field {
  background: white;
  max-width: 500px;
  margin-top: 1%;
  margin-bottom: 1%;
  height: 52px;
  border: 0.5px solid #d3d3d3;
  padding-inline-start: 1%;
  border-radius: 0px;
  font-family: "Poppins", sans-serif;
  margin-left: 5%;
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
.product-container {
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  justify-content: start;
  gap: 1%;
  padding: 2%;
}
.product-container-main {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: start;
  gap: 1%;
  padding: 2%;
}
.product-item {
  transition: transform 0.3s ease;
  max-width: 22%;
  margin: 1%;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.product-item:hover {
  transform: scale(1.1);
}
.product-item-main {
  display: flex;
  flex: 1 1 22%;
  max-width: 100%;
  box-sizing: border-box;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
.product-item:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 140, 0.2);
}
.product-item-main:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 140, 0.2);
}
.image-container {
  overflow: visible;
  position: relative;
}
.image-container-main {
  overflow: visible;
  position: relative;
}
.product-image {
  transition: transform 0.3s ease;
  width: 94%;
  margin: 3%;
  height: auto;
  display: block;
}
.anverso,
.reverso {
  width: 95%;
  height: auto;
  transition: transform 0.3s ease;
  margin: 3%;
}
.anverso:hover,
.reverso:hover {
  transform: scale(1.5);
  position: relative;
  z-index: 10;
}
.main-text {
  display: block;
  width: 50%;
  margin: 1%;
}
.name-text {
  font-size: 15px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #4a4a4a;
}
.name-text-main {
  font-size: 24px;
  text-align: start;
  font-family: "Poppins", sans-serif;
  color: #4a4a4a;
}
.description-text {
  font-size: 12px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #b0b0b0;
}
.description-text-main {
  font-size: 16px;
  text-align: start;
  font-family: "Poppins", sans-serif;
  color: #b0b0b0;
}
.price-text {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  color: #ffa726;
  font-weight: bold;
}
.price-text-main {
  text-align: start;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  color: #ffa726;
  font-weight: bold;
}
.dialog-name {
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  padding: 2%;
}
.dialog-description,
.dialog-status {
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  padding: 2%;
}
.dialog-price {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #ffa726;
  padding: 2%;
  font-weight: bold;
}
.open-dialog-button {
  font-size: 10px;
  color: #4a4a4a;
}
.dialog {
  max-width: 800px;
}
.close-icon {
  align-self: flex-end;
  margin: 1%;
}
.dialog-image {
  height: 250px;
  margin-bottom: 5%;
  margin-left: 1%;
}
.contact-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  border: none;
  margin-left: 5%;
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
