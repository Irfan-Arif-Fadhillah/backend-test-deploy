# MyApp - Modern Admin Dashboard

A modern admin dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🔐 Authentication (Login/Logout)
- 🎨 Dark/Light mode with system preference
- 📱 Responsive design
- 🚀 Built with Next.js App Router
- 🎨 Styled with Tailwind CSS
- 🛠️ UI components from shadcn/ui

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- PostgreSQL database (for backend)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser**
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

- `src/app` - Application pages and routing
- `src/components` - Reusable UI components
- `src/contexts` - React context providers
- `src/lib` - Utility functions and configurations
- `public` - Static assets

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
