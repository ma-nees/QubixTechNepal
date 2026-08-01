# Qubix Tech Nepal

![Qubix Tech Nepal](https://raw.githubusercontent.com/ma-nees/QubixTechNepal/main/src/assets/hero.webp)

**Building Technology That Moves Nepal Forward.** 

Qubix Tech Nepal is a modern, full-stack landing page and web application built to showcase software, SaaS, and AI development services. The platform features a dynamic portfolio, an integrated AI assistant, and a protected admin dashboard.

---

## 🚀 Features

- **Mistral AI Assistant:** A custom floating AI chatbot powered by Mistral AI that intelligently routes users, answers business queries, and addresses users by their authenticated name.
- **Dynamic Portfolio & Admin Panel:** Manage active, inactive, and planned projects securely via a Supabase-powered backend.
- **Lightning Fast Routing:** Built on **TanStack Router** for 100% type-safe, instant navigation.
- **Secure Authentication:** Integrated with Supabase Auth for seamless user login and admin protection.
- **Contact System:** Real-time email delivery powered by EmailJS.
- **Modern UI/UX:** Styled completely with Tailwind CSS, featuring subtle micro-animations, glassmorphism, and responsive design.

## 🛠 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** [Supabase](https://supabase.com)
- **AI Integration:** [Mistral AI](https://mistral.ai/)
- **Email Services:** [EmailJS](https://www.emailjs.com/)

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to a `.env` file at the root of the project:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authorized Email (Protected Route Access)
VITE_ADMIN_EMAIL=your_admin_email@gmail.com

# Mistral AI Chatbot API Key
VITE_MISTRAL_API_KEY=your_mistral_api_key
```

*Note: If you add or modify environment variables while the development server is running, you must restart the server for the changes to take effect.*

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ma-nees/QubixTechNepal.git
   cd QubixTechNepal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file based on `.env.example` and fill in your keys.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deployment (Vercel / Netlify)

When deploying to a production platform like Vercel, do **not** upload your local `.env` file. Instead:

1. Go to your hosting dashboard's **Environment Variables** settings.
2. Manually add all variables (`VITE_SUPABASE_URL`, `VITE_MISTRAL_API_KEY`, etc.).
3. Trigger a **Redeploy** to ensure the build pipeline injects the keys into the production bundle.

---

*Engineered in Kathmandu, Nepal.*
