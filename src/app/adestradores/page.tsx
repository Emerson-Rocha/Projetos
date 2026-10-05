"use client";

import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import "./adestradores.css";
import Titulo from "@/components/UI/Titulo/Titulo";

type Adestrador = {
  id: string;
  nome: string;
  telefone: string;
  animalId: string;
  animal: string;
  status: string;
  experiencia: string;
  nivel: string;
  observacoes: string;
};

const adestradores: Adestrador[] = [
  {
    id: "ADS-001",
    nome: "Ricardo Martins",
    telefone: "(15) 99871-2244",
    animalId: "ANM-104",
    animal: "Golden Retriever",
    status: "Em andamento",
    experiencia: "Especialista em cães de grande porte",
    nivel: "Avançado",
    observacoes:
      "Animal apresenta ótimo comportamento e responde aos comandos básicos.",
  },
  {
    id: "ADS-002",
    nome: "Fernanda Lima",
    telefone: "(15) 99744-5521",
    animalId: "ANM-208",
    animal: "Gato Siamês",
    status: "Intermediário",
    experiencia: "Adestramento comportamental felino",
    nivel: "Intermediário",
    observacoes:
      "Treinamento focado em socialização e adaptação a ambientes internos.",
  },
  {
    id: "ADS-003",
    nome: "Paulo Henrique",
    telefone: "(15) 99654-3321",
    animalId: "ANM-315",
    animal: "Labrador",
    status: "Concluído",
    experiencia: "Treinamento avançado",
    nivel: "Concluído",
    observacoes:
      "Animal apto para adoção e totalmente treinado.",
  },
];

export default function Adestradores() {
  const [adestradorSelecionado, setAdestradorSelecionado] =
    useState<Adestrador | null>(null);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Concluído":
        return "status-concluido";

      case "Em andamento":
        return "status-andamento";

      default:
        return "status-intermediario";
    }
  };

  return (
    <Layout>
      <div className="adestradores-container">
        <Titulo
          titulo="Lista de Adestradores"
          descricao="Controle e acompanhamento dos animais em processo de adestramento."
        />

        <div className="adestradores-table-container">
          <div className="adestradores-table-header">
            <span>ID</span>
            <span>Adestrador</span>
            <span>Telefone</span>
            <span>ID Animal</span>
            <span>Animal</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {adestradores.map((adestrador) => (
            <div
              className="adestradores-table-row"
              key={adestrador.id}
            >
              <span>{adestrador.id}</span>

              <span>{adestrador.nome}</span>

              <span>{adestrador.telefone}</span>

              <span className="adestradores-animal-id">
                {adestrador.animalId}
              </span>

              <span>{adestrador.animal}</span>

              <span
                className={getStatusClass(
                  adestrador.status
                )}
              >
                {adestrador.status}
              </span>

              <button
                className="adestradores-btn-detalhes"
                onClick={() =>
                  setAdestradorSelecionado(
                    adestrador
                  )
                }
              >
                Detalhes
              </button>
            </div>
          ))}
        </div>

        {adestradorSelecionado && (
          <div className="adestradores-modal-overlay">
            <div className="adestradores-modal-container">
              <h2>Detalhes do Adestramento</h2>

              <div className="adestradores-modal-grid">
                <div className="adestradores-info-box">
                  <strong>Adestrador:</strong>
                  <span>
                    {adestradorSelecionado.nome}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>ID:</strong>
                  <span>
                    {adestradorSelecionado.id}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>Animal:</strong>
                  <span>
                    {adestradorSelecionado.animal}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>ID Animal:</strong>
                  <span>
                    {adestradorSelecionado.animalId}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>Telefone:</strong>
                  <span>
                    {adestradorSelecionado.telefone}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>Status:</strong>
                  <span>
                    {adestradorSelecionado.status}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>Nível:</strong>
                  <span>
                    {adestradorSelecionado.nivel}
                  </span>
                </div>

                <div className="adestradores-info-box">
                  <strong>Experiência:</strong>
                  <span>
                    {adestradorSelecionado.experiencia}
                  </span>
                </div>

                <div className="adestradores-info-box adestradores-full">
                  <strong>Observações:</strong>
                  <span>
                    {adestradorSelecionado.observacoes}
                  </span>
                </div>
              </div>

              <div className="adestradores-modal-buttons">
                <button
                  className="adestradores-btn-fechar"
                  onClick={() =>
                    setAdestradorSelecionado(null)
                  }
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}