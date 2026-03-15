# 🏺 Chespirito Cliente Frontend

[![Nuxt.js](https://img.shields.io/badge/Nuxt-3.12.1-00DC82?style=flat&logo=nuxt.js)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue-3.4.27-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.7.2-1867C0?style=flat&logo=vuetify)](https://vuetifyjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)

Una aplicación frontend moderna construida con Nuxt 3 para el cliente de Antiguedades Chespirito. Esta aplicación permite a los usuarios navegar por categorías de productos, ver detalles de productos y gestionar su experiencia de compra de manera intuitiva.

## ✨ Características

- 🛍️ **Navegación por Categorías**: Explora productos organizados en categorías específicas.
- 📦 **Detalles de Productos**: Vista detallada de cada producto con información completa.
- 🎨 **Interfaz Moderna**: Diseño responsivo con Vuetify y Material Design Icons.
- 🌐 **SEO Optimizado**: Integración con Nuxt.js para un mejor posicionamiento en motores de búsqueda.
- 📱 **Responsive**: Compatible con dispositivos móviles y de escritorio.
- 🚀 **Rendimiento**: Construido con Nuxt 3 para una experiencia rápida y fluida.

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Nuxt 3](https://nuxt.com/) - Framework Vue.js full-stack
- **UI Library**: [Vuetify 3](https://vuetifyjs.com/) - Componentes Material Design
- **Icons**: [Material Design Icons](https://materialdesignicons.com/)
- **Styling**: [Sass](https://sass-lang.com/) - Preprocesador CSS
- **Animations**: [Animate.css](https://animate.style/) - Librería de animaciones CSS
- **Utilities**: [Lodash](https://lodash.com/) - Utilidades JavaScript
- **Date Handling**: [Moment.js](https://momentjs.com/) - Manejo de fechas y zonas horarias
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/) - Modales y alertas elegantes

## 📋 Prerrequisitos

- Node.js 18+
- npm, pnpm, yarn o bun

## 🚀 Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/AndresRojo12/chespirito-cliente.git
   cd frontend-client-chespirito
   ```

2. **Instala las dependencias**:
   ```bash
   # Con npm
   npm install

   # Con pnpm
   pnpm install

   # Con yarn
   yarn install

   # Con bun
   bun install
   ```

3. **Configura las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   API_BASE_URL=https://tu-api-url.com
   WPP=tu-numero-whatsapp
   PUBLIC_FACEBOOK=tu-enlace-facebook
   ```

## 🏃‍♂️ Desarrollo

Inicia el servidor de desarrollo:

```bash
# Con npm
npm run dev

# Con pnpm
pnpm run dev

# Con yarn
yarn dev

# Con bun
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🏗️ Producción

1. **Construye la aplicación**:
   ```bash
   # Con npm
   npm run build

   # Con pnpm
   pnpm run build

   # Con yarn
   yarn build
   ```

2. **Vista previa de producción**:
   ```bash
   # Con npm
   npm run preview

   # Con pnpm
   pnpm run preview

   # Con yarn
   yarn preview
   ```

3. **Genera sitio estático** (opcional):
   ```bash
   # Con npm
   npm run generate

   # Con pnpm
   pnpm run generate

   # Con yarn
   yarn generate
   ```

## 📁 Estructura del Proyecto

```
frontend-client-chespirito/
├── app.vue                 # Punto de entrada principal
├── nuxt.config.ts          # Configuración de Nuxt
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── components/             # Componentes Vue reutilizables
│   ├── LoadingSpinner.vue
│   ├── categories/
│   └── products/
├── layouts/                # Layouts de la aplicación
│   └── default.vue
├── pages/                  # Páginas de la aplicación
│   ├── index.vue
│   ├── principal-client.vue
│   ├── categories/[id].vue
│   └── products/[id].vue
├── plugins/                # Plugins de Nuxt
│   └── vuetify.js
├── public/                 # Archivos estáticos públicos
├── server/                 # Configuración del servidor
└── static/                 # Archivos estáticos
```

## 🎯 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run generate` - Genera sitio estático
- `npm run preview` - Vista previa de la build de producción

## 🌐 Despliegue

Esta aplicación puede desplegarse en cualquier plataforma que soporte Node.js:

- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Despliegue con funciones serverless
- **Heroku**: Usando el Procfile incluido
- **Railway**: Despliegue directo desde Git

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- Email: info@antiguedadeschespirito.com

---

Hecho con Nuxt 3 y Vuetify

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
