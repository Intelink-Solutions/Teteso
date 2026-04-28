"use client";
/**
 * DemoShell — lightweight wrapper used by demo/sample pages.
 * Does NOT wait for the settings API so pages render instantly.
 * Uses a simple branded nav bar instead of the full Header/Footer.
 */
import CustomLink from "@/components/Common/CustomLink";
import { HiOutlineTag } from "react-icons/hi";

export default function DemoShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal top bar */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl flex items-center gap-3 h-14">
          <CustomLink href="/" className="flex items-center gap-2 font-bold text-primary text-lg">
            <HiOutlineTag size={22} />
            Eclassify
          </CustomLink>
          <nav className="flex items-center gap-4 ltr:ml-auto rtl:mr-auto text-sm font-medium">
            <CustomLink href="/category" className="hover:text-primary transition-colors">
              Categories
            </CustomLink>
            <CustomLink href="/seller/demo" className="hover:text-primary transition-colors">
              Seller Demo
            </CustomLink>
            <CustomLink href="/" className="hover:text-primary transition-colors">
              Home
            </CustomLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t bg-muted py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Eclassify — Demo Page
      </footer>
    </div>
  );
}
