<template>
  <div v-if="category">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>
    <div>
      <h1 class="title">{{ category.name }}</h1>
    </div>
    <div class="subtitle">
      <h3>Productos</h3>
    </div>
    <div class="product-container">
      <div
        class="product-item"
        v-for="product in category.products"
        :key="product.id"
      >
        <div class="image-container">
          <img class="product-image" :src="getImageUrl(product.imagePath)" />
        </div>
        <h6 class="name-text">{{ product.name }}</h6>
        <p class="description-text">{{ product.description }}</p>
        <p class="price-text">{{ formatPrice(product.price) }}</p>
        <v-card-actions>
          <v-btn class="open-dialog-button" @click="openDialog(product)"
            >Ver más...</v-btn
          >
        </v-card-actions>
      </div>
    </div>
    <v-dialog class="dialog" v-model="showDialog">
      <v-card>
        <v-icon @click="showDialog = false" class="close-icon">
          mdi-close
        </v-icon>
        <div style="display: inline-flex">
          <v-img class="dialog-image" :src="selectedProduct?.imagePath"></v-img>
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
const error = ref(null);
const showDialog = ref(false);
const selectedProduct = ref(null);

const fetchCategory = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/categories/${id}`
    );
    category.value = data.value;
  } catch (err) {
    error.value = err;
  }
};

const getImageUrl = (imagePath) => {
  return imagePath;
};

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

const openDialog = (product) => {
  selectedProduct.value = product;
  showDialog.value = true;
};

onMounted(async () => {
  await nextTick();
  await fetchCategory();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.title {
  background: linear-gradient(
    to bottom,
    rgba(0, 156, 140, 0.8),
    rgba(0, 183, 162, 0.8)
  );
  color: white;
  font-family: "Poppins", sans-serif;
  text-align: center;
  margin: 0.2%;
  font-size: 48px;
}
.subtitle {
  font-family: "Poppins", sans-serif;
  margin-top: 2%;
  margin-left: 9%;
  color: rgba(0, 0, 0, 0.8);
  font-size: 24px;
}
.product-container {
  display: flex;
  flex-wrap: wrap;
  margin-left: 3%;
}
.product-item {
  flex: 1 1 22%;
  max-width: 22%;
  margin: 1%;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
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
  width: 94%;
  margin: 3%;
  height: auto;
  display: block;
}
.image-container:hover .product-image {
  transform: scale(1.9);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
}
.name-text {
  font-size: 15px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #4a4a4a;
}
.description-text {
  font-size: 12px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #b0b0b0;
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
.price-text {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  color: #ffa726;
  font-weight: bold;
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
