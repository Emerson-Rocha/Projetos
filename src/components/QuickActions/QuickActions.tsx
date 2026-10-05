"use client";

import "./QuickActions.css";

import Link from "next/link";

import {
  Plus,
  PawPrint,
  Syringe,
  File,
} from "lucide-react";

export default function QuickActions() {

  const actions = [
    {
      title: "Cadastrar Animal",
      icon: <Plus />,
      href: "/cadastro-animais",
    },

    {
      title: "Lista de Animais",
      icon: <PawPrint />,
      href: "/lista-animais",
    },

    {
      title: "Registrar Vacina",
      icon: <Syringe />,
      href: "/cadastro-vacinas",
    },

    {
      title: "Verificar Solicitações",
      icon: <File />,
      href: "/solicitacoes-adocao",
    },
  ];

  return (
    <section className="quick-section">

      <h2>Ações Rápidas</h2>

      <div className="quick-grid">

        {actions.map((action, index) => (

          <Link
            key={index}
            href={action.href}
            className="quick-card"
          >

            {action.icon}

            <span>{action.title}</span>

          </Link>

        ))}

      </div>

    </section>
  );
}