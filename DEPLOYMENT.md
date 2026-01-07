# 🚀 Guía de Deployment - RappiFact Landing Page

## Opciones de Deployment

### 1️⃣ Netlify (Recomendado) ⭐

**Por qué Netlify:**
- Deployment automático desde Git
- SSL gratis
- CDN global
- Formularios integrados
- Dominio custom fácil

**Pasos:**

1. Crear cuenta en [netlify.com](https://netlify.com)

2. Conectar repositorio Git:
   ```bash
   cd /Users/noel/Desktop/iubi/Projects/RappiFact
   git init
   git add .
   git commit -m "Initial commit - RappiFact Landing Page"
   git remote add origin [URL-DE-TU-REPO]
   git push -u origin main
   ```

3. En Netlify Dashboard:
   - Click "Add new site" → "Import an existing project"
   - Conectar con GitHub/GitLab/Bitbucket
   - Seleccionar el repositorio
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **¡Listo!** Tu sitio estará en: `https://random-name.netlify.app`

5. Configurar dominio custom:
   - Domain settings → Add custom domain
   - Seguir instrucciones para configurar DNS

---

### 2️⃣ Vercel

**Pasos:**

1. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Desde el directorio del proyecto:
   ```bash
   vercel
   ```

3. Seguir el asistente:
   - Login con tu cuenta
   - Configurar proyecto
   - Deploy automático

4. Para deployments futuros:
   ```bash
   vercel --prod
   ```

**URL:** Tu sitio estará en `https://tu-proyecto.vercel.app`

---

### 3️⃣ Cloudflare Pages

**Pasos:**

1. Ir a [pages.cloudflare.com](https://pages.cloudflare.com)

2. Conectar repositorio Git

3. Configuración:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`

4. Click "Save and Deploy"

**Ventajas:** CDN ultra-rápido de Cloudflare + Analytics gratis

---

### 4️⃣ GitHub Pages

**Pasos:**

1. Instalar adaptador:
   ```bash
   npm install --save-dev @astrojs/github-pages
   ```

2. Actualizar `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://tuusuario.github.io',
     base: '/rappifact',
     integrations: [tailwind()],
   });
   ```

3. Crear `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: '20'
         
         - name: Install dependencies
           run: npm install
         
         - name: Build
           run: npm run build
         
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. En GitHub:
   - Settings → Pages
   - Source: GitHub Actions
   - Push tu código

---

## 🔧 Configuración de Dominio Custom

### Netlify/Vercel/Cloudflare:

1. Comprar dominio (ej: `rappifact.com` en Namecheap, GoDaddy, etc.)

2. Configurar DNS Records:
   ```
   Type: A
   Name: @
   Value: [IP proporcionada por el servicio]

   Type: CNAME
   Name: www
   Value: [tu-sitio.netlify.app]
   ```

3. Esperar propagación DNS (5-48 horas)

4. Activar SSL en el dashboard del servicio

---

## 📊 Analytics y Tracking

### Google Analytics 4

Agregar en `src/layouts/Layout.astro` antes del `</head>`:

```astro
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel

```astro
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'TU_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

---

## 🌐 Variables de Entorno

Si necesitas variables de entorno, crea `.env`:

```env
PUBLIC_SITE_URL=https://rappifact.com
PUBLIC_WHATSAPP=51916924141
PUBLIC_PHONE=+51916924141
PUBLIC_EMAIL=contacto@rappifact.com
```

Usar en Astro:
```javascript
const whatsapp = import.meta.env.PUBLIC_WHATSAPP;
```

**Importante:** En Netlify/Vercel, configura las variables en el dashboard.

---

## ✅ Checklist Pre-Deployment

- [ ] Actualizar información de contacto
- [ ] Verificar todos los enlaces
- [ ] Probar formularios (si aplica)
- [ ] Optimizar imágenes
- [ ] Configurar Analytics
- [ ] Configurar meta tags para SEO
- [ ] Crear sitemap.xml
- [ ] Configurar robots.txt
- [ ] Probar en diferentes dispositivos
- [ ] Verificar velocidad en PageSpeed Insights
- [ ] Configurar SSL
- [ ] Configurar dominio custom

---

## 🔒 Seguridad

### Headers de Seguridad (netlify.toml)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## 📈 Monitoreo Post-Deployment

1. **Google Search Console**
   - Verificar propiedad del sitio
   - Enviar sitemap
   - Monitorear indexación

2. **PageSpeed Insights**
   - Verificar rendimiento
   - Optimizar según recomendaciones

3. **Uptime Monitoring**
   - UptimeRobot (gratis)
   - Pingdom

---

## 🚀 Deployment Rápido (Comando Simple)

Para Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Para Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

---

## 📞 Soporte

Si tienes problemas:
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- Astro: https://docs.astro.build

---

## 🎉 ¡Listo para Despegar!

Tu landing page está optimizada y lista para recibir tráfico y convertir visitantes en clientes.

**¡Éxito con RappiFact! 🚀**

