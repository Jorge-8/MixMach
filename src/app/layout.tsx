import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "@/components/ui/Sidebar";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MyRecipesProvider } from "@/context/MyRecipesContext";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MixMatch",
  description: "Encuentra cócteles con lo que tienes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body
        style={{ fontFamily: "var(--font-poppins)" }}
        className="h-screen flex flex-row overflow-hidden"
      >

        <AuthProvider>
          <FavoritesProvider>
            <MyRecipesProvider>
              <Sidebar />
              <main className="flex-1 bg-[#FFF8F0] dark:bg-[#0f0f23] relative flex flex-col">
                {/* Círculos */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                  <div className="absolute top-[-100px] left-[10%] w-72 h-72 bg-[#FF6B6B]/20 rounded-full blur-3xl" />
                  <div className="absolute top-[30%] right-[5%] w-96 h-96 bg-[#4ECDC4]/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-[#FFD93D]/20 rounded-full blur-3xl" />
                  <div className="absolute top-[60%] left-[5%] w-64 h-64 bg-[#FF6B6B]/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-[-50px] right-[20%] w-72 h-72 bg-[#4ECDC4]/15 rounded-full blur-3xl" />
                </div>

                {/* Contenido */}
                <div className="relative z-10 flex-1 flex flex-col overflow-y-auto">
                  {children}
                </div>
              </main>
            </MyRecipesProvider>
          </FavoritesProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
