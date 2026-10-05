"use client";

import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import "./adotantes.css";
import Titulo from "@/components/UI/Titulo/Titulo";

type Adotante = {
  id: string;
  nome: string;
  rg: string;
  animalId: string;
  animal: string;
  status: string;
  telefone: string;
  endereco: string;
  cidade: string;
  experiencia: string;
};

const adotantes: Adotante[] = [
  {
    id: "ADT-001",
    nome: "Maria Oliveira",
    rg: "45.987.123-8",
    animalId: "ANM-104",
    animal: "Golden Retriever",
    status: "Já adotou",
    telefone: "(15) 99876-1122",
    endereco: "Rua das Flores, 120",
    cidade: "Votorantim",
    experiencia: "Possui experiência com cães",
  },
  {
    id: "ADT-002",
    nome: "Carlos Henrique",
    rg: "52.741.963-1",
    animalId: "ANM-208",
    animal: "Gato Siamês",
    status: "Primeira adoção",
    telefone: "(15) 99741-8877",
    endereco: "Av. Central, 450",
    cidade: "Sorocaba",
    experiencia: "Primeira adoção",
  },
  {
    id: "ADT-003",
    nome: "Fernanda Souza",
    rg: "41.258.774-0",
    animalId: "ANM-315",
    animal: "Labrador",
    status: "Já adotou",
    telefone: "(15) 99632-5541",
    endereco: "Rua Palmeiras, 78",
    cidade: "Votorantim",
    experiencia: "Já adotou anteriormente",
  },
  {
    id: "ADT-004",
    nome: "Juliana Martins",
    rg: "39.654.221-5",
    animalId: "ANM-412",
    animal: "Coelho",
    status: "Primeira adoção",
    telefone: "(15) 99122-4433",
    endereco: "Rua Primavera, 900",
    cidade: "Sorocaba",
    experiencia: "Sem experiência",
  },
];

export default function Adotantes() {
  const [adotanteSelecionado, setAdotanteSelecionado] =
    useState<Adotante | null>(null);

  return (
    <Layout>
      <section className="adotantes-container">
        <Titulo
          titulo="Lista de Adotantes"
          descricao="Confira os adotantes registrados no sistema."
        />

        <div className="adotantes-table-container">

          <div className="adotantes-table-header">
            <span>ID</span>
            <span>Nome</span>
            <span>RG</span>
            <span>ID Animal</span>
            <span>Animal</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {adotantes.map((adotante) => (
            <div
              className="adotantes-table-row"
              key={adotante.id}
            >
              <span>{adotante.id}</span>

              <span>{adotante.nome}</span>

              <span>{adotante.rg}</span>

              <span className="adotantes-animal-id">
                {adotante.animalId}
              </span>

              <span>{adotante.animal}</span>

              <span
                className={
                  adotante.status === "Já adotou"
                    ? "adotantes-status-aprovado"
                    : "adotantes-status-primeira"
                }
              >
                {adotante.status}
              </span>

              <button
                className="adotantes-btn-detalhes"
                onClick={() =>
                  setAdotanteSelecionado(adotante)
                }
              >
                Detalhes
              </button>
            </div>
          ))}
        </div>

        {adotanteSelecionado && (
          <div className="adotantes-modal-overlay">
            <div className="adotantes-modal-container">

              <h2>
                Detalhes do Adotante
              </h2>

              <div className="adotantes-modal-grid">

                <div className="adotantes-info-box">
                  <strong>Nome:</strong>
                  <span>
                    {adotanteSelecionado.nome}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>RG:</strong>
                  <span>
                    {adotanteSelecionado.rg}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>ID Animal:</strong>
                  <span>
                    {adotanteSelecionado.animalId}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>Animal:</strong>
                  <span>
                    {adotanteSelecionado.animal}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>Status:</strong>
                  <span>
                    {adotanteSelecionado.status}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>Telefone:</strong>
                  <span>
                    {adotanteSelecionado.telefone}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>Endereço:</strong>
                  <span>
                    {adotanteSelecionado.endereco}
                  </span>
                </div>

                <div className="adotantes-info-box">
                  <strong>Cidade:</strong>
                  <span>
                    {adotanteSelecionado.cidade}
                  </span>
                </div>

                <div className="adotantes-info-box adotantes-full">
                  <strong>Experiência:</strong>
                  <span>
                    {adotanteSelecionado.experiencia}
                  </span>
                </div>

              </div>

              <div className="adotantes-modal-buttons">
                <button
                  className="adotantes-btn-fechar"
                  onClick={() =>
                    setAdotanteSelecionado(null)
                  }
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}