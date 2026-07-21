<div align="center">
  <h1>🚀 Charvia</h1>
  <p><strong>The AI-Powered Career Platform & Portfolio Builder</strong></p>
</div>

Charvia is a modern, full-stack application designed to help professionals elevate their careers. It features an intelligent **AI Portfolio Builder** that can automatically extract data from your resume, enhance your professional summary and experience using Gemini AI, and instantly generate a beautiful, responsive portfolio website that you can customize and publish.

## ✨ Key Features

- **📄 Smart Resume Parsing**: Upload your PDF/DOCX resume and Charvia automatically extracts your data.
- **🤖 AI Content Enhancement**: Leverages Google's Gemini AI to rewrite weak bullet points, generate punchy summaries, and suggest impactful action verbs.
- **🎨 AI Portfolio Generator**: Instantly generates a complete portfolio (Hero, About, Skills, Experience, Projects) based on your enhanced resume.
- **🖱️ Drag & Drop Builder**: Customize your portfolio layout effortlessly with a split-pane drag-and-drop editor.
- **🌗 Custom Themes**: Switch between various premium themes (Minimal, Developer, Cyberpunk, etc.) without losing your content.
- **🌐 One-Click Publishing**: Publish your portfolio instantly to a dynamic public URL (`yourusername.charvia.app`).

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **Authentication**: Supabase Auth
- **AI**: Google Gemini (via `@google/genai`)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/Rapolucharankumar/Charvia.git
cd Charvia
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your keys:

```env
# PostgreSQL Database Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/charvia?schema=public"

# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Gemini AI Key
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Setup the Database

Sync your Prisma schema with your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Rapolucharankumar/Charvia/issues).

---

<div align="center">
  Built with ❤️ using Next.js and Prisma.
</div>
