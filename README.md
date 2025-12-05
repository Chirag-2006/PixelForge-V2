# pixelForge – AI Image Generator 🚀

A modern AI-based image generation platform built with **Next.js**, **Clerk Authentication**, **MySQL**, **Drizzle ORM**, **ShadCN UI**, and advanced AI models via **Pollination AI**, with secure image storage using **Cloudinary**.

---

## ✨ Features

### 🖼️ AI Image Generation

- High-quality prompt-based image generation
- Pollination AI integration
- Smart loading + request handling
- Duplicate request prevention
- Real-time generation count (ex: `4/5 images used`)
- Free limit detection — button auto-switches to **Upgrade Plan**

### 🔒 Authentication & User System

- Seamless sign-in with Clerk
- OAuth support
- User data stored in MySQL (Drizzle ORM)

### ☁️ Cloud Image Storage

- Cloudinary upload system
- Auto-optimized high-quality URLs
- Images stored & linked to user

### 📊 Dashboard

- See all generated images
- Track daily usage
- 3-tab UI using ShadCN components
- Clean & fast layout

### 🎨 Modern UI/UX

- Built with ShadCN UI + TailwindCSS
- Smooth animations using Framer Motion
- Fully responsive
- Beautiful buttons, cards, modals, tabs

---

## 🛠️ Tech Stack

### **Frontend**

- Next.js 14 (App Router)
- TailwindCSS
- ShadCN UI
- React
- Axios
- React Query

### **Backend**

- Next.js API Routes
- Pollination AI
- Drizzle ORM
- MySQL
- Clerk Auth

### **Icon**

- Lucide React

### **Cloud**

- Cloudinary CDN

---

## 📂 Folder Structure (Simplified)

```
pixelForge/
 ├─ app/
 │   ├─ (protected)/
 │   ├─ (public)/
 │   ├─ api/
 │   │   └─ generate/route.js
 │   └─ layout.js
 ├─ components/
 ├─ lib/
 │   ├─ aiImageGenerator.js
 │   └─ utils.js
 ├─ db/
 │   ├─ index.js
 │   ├─ schema.js
 ├─ public/
 └─ README.md
```

---

## 🔧 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Chirag-2006/PixelForge-V2.git
cd pixelForge
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create Environment File

Add `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4️⃣ Setup Database

```bash
npm run db:push
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

---

## 🚀 API Route

### **POST /api/generate**

#### Request Body:

```json
{
  "prompt": "a futuristic neon dragon flying in clouds"
}
```

### 🔄 API Process Flow:

1. Authenticate Clerk user
2. Check user’s free usage limit
3. Send prompt → Pollination AI
4. Convert output to buffer
5. Upload image → Cloudinary
6. Store image URL in MySQL using Drizzle
7. Return URL to frontend

---

## 📸 Screenshots (Add Later)

```
[ ] Homepage
[ ] Generate Page
[ ] Dashboard
[ ] Upgrade Modal
```

---

## 🚀 Upcoming Improvements

- Stripe payment integration
- Unlimited Pro images
- User prompt history
- Advanced upscaling model
- Share-to-social feature

---

## 👨‍💻 Author

**Chirag Arya**  
Full-Stack + AI Developer  
Creator of pixelForge

---

## 📄 License

MIT License
