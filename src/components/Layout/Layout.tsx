import "./Layout.css";

import Navbar from "@/components/Navbar/Navbar";
import Menu from "@/components/Menu/Menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  return (
    <main className="layout-container">

      <Navbar />

      <Menu />

      <section className="page-content">
        {children}
      </section>

    </main>
  );
}