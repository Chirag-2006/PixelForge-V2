# 🚀 pixelForge — AI Image Generation Platform

![PixelForge banner](https://res.cloudinary.com/ddrrc7kbh/image/upload/v1778994560/pixelForge_banner_mpb6ua.png)

<div align="center">

### Create Stunning AI Images with Modern Web Technologies ✨

An advanced AI-powered image generation platform built using **Next.js 14**, **Clerk Authentication**, **Drizzle ORM**, **MySQL**, **Cloudinary**, and **Pollination AI**.

Designed with a modern UI/UX using **ShadCN UI**, **TailwindCSS**, and smooth animations powered by **Framer Motion**.

</div>

---

## 🌟 Overview

**pixelForge** is a full-stack AI image generation platform where users can generate high-quality AI images from text prompts in real-time.

The platform includes:

- 🔐 Secure authentication
- ☁️ Cloud image storage
- 📊 User dashboard
- ⚡ Fast AI generation workflow
- 🎨 Beautiful modern interface
- 📱 Fully responsive design

---

# ✨ Core Features

## 🖼️ AI Image Generation

Generate stunning AI images instantly using powerful AI models.

### Features Included:

- Prompt-based image generation
- Pollination AI integration
- Real-time loading states
- Duplicate request prevention
- Smart request handling
- Usage tracking system
- Daily free image limits
- Auto-switch to **Upgrade Plan** when limit exceeds

---

## 🔒 Authentication System

Secure and modern authentication powered by Clerk.

### Includes:

- Email authentication
- OAuth login support
- Protected routes
- Session handling
- User-based image storage

---

## ☁️ Cloudinary Image Storage

All generated images are securely stored in Cloudinary CDN.

### Benefits:

- Fast image delivery
- Optimized image URLs
- High-quality image rendering
- Secure cloud storage
- User-specific image management

---

## 📊 Dashboard Experience

A clean dashboard for managing generated images.

### Dashboard Features:

- View all generated images
- Track daily usage
- Responsive tab layout
- Smooth UI transitions
- Modern ShadCN components

---

## 🎨 Modern UI/UX

Built with a clean and premium design approach.

### UI Highlights:

- ShadCN UI components
- TailwindCSS styling
- Framer Motion animations
- Fully responsive layout
- Beautiful cards, modals & tabs
- Smooth user interactions

---

# 🛠️ Tech Stack

## ⚡ Frontend

- Next.js 14 (App Router)
- React.js
- TailwindCSS
- ShadCN UI
- Axios
- React Query
- Framer Motion

---

## 🔥 Backend

- Next.js API Routes
- Pollination AI
- Clerk Authentication
- Drizzle ORM
- MySQL Database

---

## ☁️ Cloud Services

- Cloudinary CDN

---

## 🎯 Icons & UI

- Lucide React

---

# 📂 Project Structure

```bash
pixelForge/
│
├── app/
│   ├── (protected)/
│   ├── (public)/
│   ├── api/
│   │   └── generate/
│   │       └── route.js
│   └── layout.js
│
├── components/
├── lib/
│   ├── aiImageGenerator.js
│   └── utils.js
│
├── data/
│
├── db/
│   ├── index.js
│   └── schema.js
│
├── public/
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Chirag-2006/PixelForge-V2.git
cd pixelForge
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=

POLLINATIONS_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 4️⃣ Setup Database

```bash
npm run db:push
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 🚀 API Endpoint

## `POST /api/generate`

Generate AI images from user prompts.

---

## 📥 Request Body

```json
{
  "prompt": "a futuristic neon dragon flying in clouds"
}
```

---

## ⚡ API Workflow

```text
1. Authenticate User via Clerk
2. Validate Daily Usage Limit
3. Send Prompt to Pollination AI
4. Convert AI Output to Buffer
5. Upload Image to Cloudinary
6. Store URL in MySQL via Drizzle ORM
7. Return Image URL to Frontend
```

---

# 📸 Screenshots

> Add your project screenshots here

```text
[ ] Homepage
[ ] AI Generate Page
[ ] Dashboard
[ ] Upgrade Modal
[ ] Mobile Responsive UI
```

---

# 🚀 Future Improvements

- 💳 Stripe Payment Integration
- 🔥 Unlimited Pro Plan
- 📝 Prompt History
- 🖼️ AI Upscaling Models
- 🌍 Share-to-Social Feature
- 🎭 Multiple AI Styles
- 📦 Image Download Manager

---

# 👨‍💻 Author

## Chirag Arya

Full-Stack Web Developer & AI Enthusiast

- 🎓 IIT Kharagpur Graduate
- 💻 MERN & Next.js Developer
- 🚀 Passionate about AI-powered applications

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you like this project, consider giving it a star on GitHub ⭐

</div>