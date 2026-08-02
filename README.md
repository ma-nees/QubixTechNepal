<div align="center">
  
  <img src="https://raw.githubusercontent.com/ma-nees/QubixTechNepal/main/src/assets/hero.webp" alt="Qubix Tech Nepal Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # 🏔️ Qubix Tech Nepal
  
  **Building Technology That Moves Nepal Forward.**
  
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://tanstack.com/router"><img src="https://img.shields.io/badge/TanStack_Router-Latest-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="TanStack Router" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://mistral.ai/"><img src="https://img.shields.io/badge/Mistral_AI-Chatbot-F54E42?style=for-the-badge&logo=openai&logoColor=white" alt="Mistral AI" /></a>
  </p>

  <p align="center">
    A premium, full-stack landing page and web application built to showcase world-class software, SaaS, and AI development services. 
  </p>
</div>

<br/>

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🤖 **AI Assistant** | A floating, intelligent chatbot powered by **Mistral AI** that routes users, answers business queries, and personalizes greetings using authenticated names. |
| ⚡ **Lightning Fast** | 100% type-safe and instant navigation powered by **TanStack Router**. Say goodbye to loading spinners between pages. |
| 🔐 **Admin Dashboard** | A hidden, secure admin portal to manage active, inactive, and planned projects. Protected by **Supabase Auth**. |
| 📧 **Live Contact System**| Instant, real-time email delivery for client inquiries powered directly by **EmailJS**. |
| 🎨 **Premium UI/UX** | Styled with **Tailwind CSS**, featuring glassmorphism, micro-animations, and responsive layouts that look stunning on any device. |

<br/>

## 🏗️ Architecture

```text
src/
├── assets/         # Static images and icons
├── components/     # Reusable UI components (Site Footer, Reveal, Pageshell)
├── lib/            # Utilities, Context Providers (AuthContext, Supabase client)
└── routes/         # TanStack file-based routing
    ├── __root.tsx  # Global layout & Floating AI Assistant
    ├── index.tsx   # Beautiful Hero Section & Services
    ├── admin/      # Secure dashboard for project management
    └── portfolio/  # Dynamic project showcase fetched from Supabase
```

<br/>

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Clone & Install
```bash
git clone https://github.com/ma-nees/QubixTechNepal.git
cd QubixTechNepal
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root of the project and add your API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mistral AI Chatbot API Key
VITE_MISTRAL_API_KEY=your_mistral_api_key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key


```

### 3. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

<br/>

## ☁️ Deployment Guide

When deploying to a platform like **Vercel** or **Netlify**:
1. Do **NOT** upload your `.env` file.
2. Go to your hosting platform's dashboard and navigate to **Settings > Environment Variables**.
3. Paste in all the variables exactly as they appear in your `.env` file.
4. **Trigger a Redeploy** so the build system can inject the variables into your live app.

<br/>

<div align="center">
  <i>Engineered with precision in Kathmandu, Nepal. 🇳🇵</i>
</div>
