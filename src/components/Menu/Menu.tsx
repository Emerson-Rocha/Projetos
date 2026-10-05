"use client";
import Link from "next/link";

import "./Menu.css";

import { useState } from "react";

import {
  PawPrint,
  ChevronDown,
} from "lucide-react";

export default function Menu() {
  const [openCadastro, setOpenCadastro] =
    useState(false);

  const [openSolicitacoes, setOpenSolicitacoes] =
    useState(false);

  return (
    <div className="menu-wrapper">

      {/* MENU BUTTON */}
      <Link href="/" className="menu-button">

        <PawPrint size={28} />

        <span>Home</span>

      </Link>

      {/* NAVBAR */}
      <nav className="menu-navbar">

        {/* CADASTRO */}
        <div className="menu-item dropdown">

          <button className="botaodropdown"
            onClick={() =>
              setOpenCadastro(!openCadastro)
            }
          >
            Cadastro

            <ChevronDown size={18} />
          </button>

          {openCadastro && (
            <div className="dropdown-menu">

              <Link href="/cadastro-animais">
                Cadastro de Animais
              </Link>

              <Link href="/cadastro-vacinas">
                Cadastro de Vacinas
              </Link>

            </div>
          )}

        </div>

        {/* LISTA DE ANIMAIS */}
        <Link href="/lista-animais" className="menu-item">
          Lista de Animais
        </Link>

        {/* LISTA DE VACINAS */}
        <Link href="/lista-vacinas" className="menu-item">
          Lista de Vacinas
        </Link>

        {/* SAÍDA */}
        <Link href="/saida-animais" className="menu-item">
          Saída de Animais
        </Link>

        {/* ADOTANTES */}
        <Link href="/adotantes" className="menu-item">
          Adotantes
        </Link>

        {/* ADESTRADORES */}
        <Link href="/adestradores" className="menu-item">
          Adestradores
        </Link>

        {/* SOLICITAÇÕES */}
        <div className="menu-item dropdown">

          <button className="botaodropdown"
            onClick={() =>
              setOpenSolicitacoes(
                !openSolicitacoes
              )
            }
          >
            Solicitações

            <ChevronDown size={18} />
          </button>

          {openSolicitacoes && (
            <div className="dropdown-menu">

              <Link href="/solicitacoes-simples">
                Solicitações de Eventos
              </Link>

              <Link href="/solicitacoes-adocao">
                Solicitações de Adoção
              </Link>

            </div>
          )}

        </div>

      </nav>

    </div>
  );
}