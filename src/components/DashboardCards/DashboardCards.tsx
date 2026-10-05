"use client";

import "./DashboardCards.css";

import {
  PawPrint,
  Heart,
  FileClock,
  Syringe,
} from "lucide-react";

export default function DashboardCards() {
  const cards = [
    {
      title: "Animais Cadastrados",
      value: "1.248",
      icon: <PawPrint />,
    },

    {
      title: "Adoções do Mês",
      value: "27",
      icon: <Heart />,
    },

    {
      title: "Solicitações Pendentes",
      value: "14",
      icon: <FileClock />,
    },

    {
      title: "Vacinas Registradas",
      value: "8",
      icon: <Syringe />,
    },
  ];

  return (
    <div className="cards-container">

      {cards.map((card, index) => (
        <div
          className="dashboard-card"
          key={index}
        >

          <div className="card-icon">
            {card.icon}
          </div>

          <div>

            <h2>{card.value}</h2>

            <p>{card.title}</p>

          </div>

        </div>
      ))}

    </div>
  );
}