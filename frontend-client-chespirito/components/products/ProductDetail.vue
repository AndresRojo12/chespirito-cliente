<template>
  <div v-if="product">
    <v-icon class="exit-icon" @click="router.back()">mdi-arrow-left</v-icon>

    <div class="product-item">
      <div style="display: flex; justify-content: center">
        <img
          class="product-image"
          :src="getImageUrl(product.imagePath1)"
          @click="openImage(product.imagePath1)"
        />
        <img
          class="product-image"
          :src="getImageUrl(product.imagePath2)"
          @click="openImage(product.imagePath2)"
        />
      </div>
      <div style="text-align: center">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-description">Estado {{ product.status }}</p>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">{{ product.price }}</p>
      </div>
      <v-btn class="contact-button" :href="generateWhatsappLink(product)"
        >Contactar al vendedor</v-btn
      >
    </div>

    <v-dialog
      v-model="dialog"
      max-width="80vw"
      persistent
      @click:outside="closeImage"
    >
      <v-btn icon @click="closeImage">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-img
        :src="selectedImage"
        :max-height="maxHeight"
        contain
        @load="imageLoaded"
      ></v-img>
    </v-dialog>

    <v-divider class="custom-divider"></v-divider>

    <div class="main-container">
      <h1 class="category-title">Productos relacionados</h1>
      <v-carousel
        style="height: 350px; margin-top: 3%"
        hide-delimiters
        v-model="currentCardIndex"
        @change="handleCardChange"
      >
        <v-carousel-item
          v-for="index in Math.ceil(Math.min(products.length, 8) / 4)"
          :key="index"
        >
          <v-row>
            <v-col
              v-for="product in products.slice((index - 1) * 4, index * 4)"
              :key="product.id"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card>
                <v-card-title>
                  <h6 class="name-text">{{ product.name }}</h6>
                </v-card-title>
                <div>
                  <img
                    class="product-image-corousel"
                    :src="getImageUrl(product.imagePath1)"
                  />
                  <p class="description-text">{{ product.description }}</p>
                  <p class="price-text">{{ formatPrice(product.price) }}</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="open-dialog-button"
                    @click="openDialog(product)"
                  >
                    Ver más...
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
  <v-container v-else-if="error">
    <p>Error al cargar el producto: {{ error.message }}</p>
  </v-container>
  <v-container v-else-if="error">
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
const product = ref(null);
const products = ref([]);
const error = ref(null);
const currentCardIndex = ref(0);
const dialog = ref(false);
const selectedImage = ref("");
const maxHeight = ref("80vh");
const imageLoading = ref(true);

const fetchProduct = async () => {
  try {
    const { data } = await useFetch(
      `${CONFIG.public.API_BASE_URL}/products/${id}`
    );
    product.value = data.value;
  } catch (err) {
    error.value = err;
  }
};

const getProducts = async () => {
  try {
    const { data } = await useFetch(`${CONFIG.public.API_BASE_URL}/products`, {
      method: "GET",
    });
    products.value = data.value.data;
  } catch (error) {
    error.value = err;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchProduct();
  await getProducts();
});

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

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
};

const handleCardChange = (newIndex) => {
  if (newIndex >= products.value.length) {
    currentCardIndex.value = products.value.length - 1;
  } else {
    currentCardIndex.value = newIndex;
  }
};

const openImage = (imagePath) => {
  imageLoading.value = true;
  selectedImage.value = imagePath;
  dialog.value = true;
};

const closeImage = () => {
  dialog.value = false;
};

const imageLoaded = () => {
  imageLoading.value = false;
};
</script>

<style scoped>
.exit-icon {
  display: none;
}
.custom-divider {
  width: 94.7vw;
  margin: 1%;
}
.product-name {
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  padding: 1%;
}
.product-description,
.product-status {
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  margin: 1%;
}
.product-price {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #ffa726;
  padding: 1%;
  font-weight: bold;
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
}
.category-title {
  font-size: 28px;
  font-family: "Poppins", sans-serif;
  color: rgba(0, 0, 0, 0.7);
}
.main-container {
  padding: 2%;
}
.title {
  background: linear-gradient(to bottom, #009c8c, #00b7a2);
  color: white;
  font-family: "Arial", sans-serif;
  text-align: center;
  background-color: #009c8c;
}
.subtitle {
  font-family: "Arial", sans-serif;
  margin-top: 2%;
  text-align: center;
}
.product-item {
  max-width: 100%;
  margin: 1%;
  align-content: center;
  background: linear-gradient(to bottom, #f7f7f7, #eaeaea);
  padding: 2%;
}
.product-image {
  width: 500px;
  cursor: pointer;
  margin: 1%;
}
.v-card {
  text-align: center;
  max-width: 100%;
  margin: 1%;
  box-sizing: border-box;
  text-align: start;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.product-image-corousel {
  width: 94%;
  height: auto;
  cursor: pointer;
}
.name-text {
  margin-top: 1%;
  font-family: "Arial", sans-serif;
  text-align: center;
  font-size: 15px;
}
.status-text,
.description-text {
  font-size: 13px;
  text-align: center;
  color: #b0b0b0;
}
.price-text {
  font-size: 13px;
  text-align: center;
}
@media (max-width: 540px) {
  .exit-icon {
    display: flex;
    font-size: 4vw;
    margin-bottom: 4%;
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
    margin-bottom: 3%;
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
  .text {
    font-size: 5vw;
  }
}
</style>
