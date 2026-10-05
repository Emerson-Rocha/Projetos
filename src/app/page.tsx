"use client";

import "./home.css";

import Layout from "@/components/Layout/Layout";


import DashboardCards from "@/components/DashboardCards/DashboardCards";
import QuickActions from "@/components/QuickActions/QuickActions";
import AlertsPanel from "@/components/AlertsPanel/AlertsPanel";
import RecentAnimals from "@/components/RecentAnimals/RecentAnimals";





export default function Home() {
  return (
    <main className="home-container">

    <Layout>





      <section className="home-content">

        <div className="home-header">

          <h1>
            Dashboard do Sistema
          </h1>

          <p>
            Gerencie animais, adoções, vacinas e
            solicitações do Departamento de Bem-Estar Animal.
          </p>

        </div>

        <DashboardCards />

        <QuickActions />

        <div className="home-grid">

          <AlertsPanel />

          <RecentAnimals />

        </div>

      </section>
    </Layout>
    </main>
  );
}