# 🏪 Mohana Textiles - Frontend

Modern React + TypeScript frontend for Mohana Textiles e-commerce platform.

## 🚀 Tech Stack

- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5.0
- **Styling**: TailwindCSS 3.3
- **Animations**: Framer Motion 10.16, GSAP 3.12
- **Routing**: React Router 6.20
- **State**: Zustand 4.4

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

## 🔧 Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd mohana-textiles-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# App Name
VITE_APP_NAME=Mohana Textiles
```

## 🏃 Running Locally

### Development Server

```bash
npm run dev
```

App will be available at: http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
mohana-textiles-frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── admin/       # Admin components
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── admin/       # Admin pages
│   ├── lib/             # Utilities & services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── productService.ts
│   ├── store/           # Zustand stores
│   │   ├── authStore.ts
│   │   └── settingsStore.ts
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies
```

## 🎨 Features

### Public Pages

- **Home Page**: Hero section, featured products, collections
- **Products Page**: Browse all products with category filtering
- **Product Detail**: Full product information with image gallery

### Admin Panel

- **Dashboard**: Stats and analytics
- **Products Management**: Create, edit, delete products
- **Categories Management**: Manage product categories
- **Settings**: Update store information

## 🚀 Deployment (Vercel)

### 1. Connect to Vercel

- Go to https://vercel.com/new
- Import your GitHub repository
- Select framework: **Vite**

### 2. Configure Build

Vercel auto-detects Vite projects. Verify:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

```
VITE_API_URL=https://your-backend.hf.space
VITE_APP_NAME=Mohana Textiles
```

### 4. Deploy

Click **Deploy** and wait for build to complete.

Your site will be at: `https://your-project.vercel.app`

### 5. Update Backend CORS

In your backend, update `CORS_ORIGINS` to include your Vercel URL:

```
CORS_ORIGINS=https://your-project.vercel.app
```

## 🔐 Admin Access

### Login

Visit: `https://your-site.com/admin/login`

Use credentials created via backend's `create_admin.py` script.

### Admin Routes

- `/admin` - Dashboard
- `/admin/products` - Products management
- `/admin/categories` - Categories management
- `/admin/settings` - Settings

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    50: '#fef2f2',
    // ... customize colors
  }
}
```

### Branding

Update in `.env`:

```env
VITE_APP_NAME=Your Store Name
```

### Images

Place assets in `public/` folder.

## 🛠️ Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

### Format Code

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

## 🐛 Troubleshooting

### API Connection Failed

- Verify `VITE_API_URL` is correct
- Check backend is running
- Verify CORS is configured in backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check types
npx tsc --noEmit
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |
| `VITE_APP_NAME` | No | Application name (default: Mohana Textiles) |

## 🔄 API Integration

### Services

All API calls are in `src/lib/`:

- `api.ts` - Base API client
- `authService.ts` - Authentication
- `productService.ts` - Products CRUD
- `categoryService.ts` - Categories
- `settingsService.ts` - Store settings

### Adding New Endpoints

1. Add type in `src/types/index.ts`
2. Create service function in `src/lib/`
3. Use in components

Example:

```typescript
// src/lib/myService.ts
import { apiRequest } from './api';

export const getMyData = async () => {
  return apiRequest<MyType[]>('/api/myendpoint');
};
```

## 🎯 Performance

- ⚡ Vite for fast builds
- 📦 Code splitting with React.lazy()
- 🖼️ Image optimization via Google Drive
- 🎨 Tailwind CSS purging
- 📱 Mobile-first responsive design

## 🔒 Security

- Environment variables never exposed
- Token stored in sessionStorage
- HTTPS in production
- Content Security Policy via Vercel

## 📱 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📞 Support

For issues:
- Check console for errors
- Verify environment variables
- Check network tab for API calls
- Ensure backend is accessible

## 📄 License

MIT License

---

**Built with ❤️ for Mohana Textiles**
