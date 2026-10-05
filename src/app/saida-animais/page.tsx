"use client";

import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import "./saida-animais.css";
import Titulo from "@/components/UI/Titulo/Titulo";

const saidas = [
  {
    idAnimal: "ANM-104",
    animal: "Golden Retriever",
    foto:
      "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    adotante: "Maria Oliveira",
    idAdotante: "ADT-001",
    data: "12/05/2026",
    nivel: "85%",
    vacinas: "V10, Antirrábica",
    endereco: "Rua das Flores, 120",
  },
  {
    idAnimal: "ANM-208",
    animal: "Gato Siamês",
    foto:
      "https://cdn-icons-png.flaticon.com/512/2138/2138440.png",
    adotante: "Carlos Henrique",
    idAdotante: "ADT-002",
    data: "18/05/2026",
    nivel: "60%",
    vacinas: "Antirrábica",
    endereco: "Av. Central, 450",
  },
];

export default function SaidaAnimais() {
  const [animalSelecionado, setAnimalSelecionado] =
    useState<any>(null);

  return (
    <Layout>
      <section className="saida-container">

        <Titulo
          titulo="Saída de Animais"
          descricao="Animais oficialmente adotados."
        />

        <div className="saida-table-container">

          <div className="saida-table-header">
            <span>Foto</span>
            <span>ID Animal</span>
            <span>Animal</span>
            <span>Adotante</span>
            <span>ID Adotante</span>
            <span>Data</span>
            <span>Nível</span>
            <span>Ações</span>
          </div>

          {saidas.map((animal) => (

            <div
              className="saida-table-row"
              key={animal.idAnimal}
            >

              <img
                src={animal.foto}
                alt={animal.animal}
                className="saida-animal-foto"
              />

              <span>{animal.idAnimal}</span>

              <span>{animal.animal}</span>

              <span>{animal.adotante}</span>

              <span>{animal.idAdotante}</span>

              <span>{animal.data}</span>

              <span>
                {animal.nivel}
              </span>

              <button
                className="saida-btn-detalhes"
                onClick={() =>
                  setAnimalSelecionado(animal)
                }
              >
                Detalhes
              </button>

            </div>

          ))}

        </div>

        {animalSelecionado && (

          <div className="saida-modal-overlay">

            <div className="saida-modal-container">

              <h2>
                Detalhes da Adoção
              </h2>

              <div className="saida-modal-grid">

                <div className="saida-info-box">
                  <strong>Animal:</strong>
                  {animalSelecionado.animal}
                </div>

                <div className="saida-info-box">
                  <strong>ID Animal:</strong>
                  {animalSelecionado.idAnimal}
                </div>

                <div className="saida-info-box">
                  <strong>Adotante:</strong>
                  {animalSelecionado.adotante}
                </div>

                <div className="saida-info-box">
                  <strong>ID Adotante:</strong>
                  {animalSelecionado.idAdotante}
                </div>

                <div className="saida-info-box">
                  <strong>Vacinas:</strong>
                  {animalSelecionado.vacinas}
                </div>

                <div className="saida-info-box">
                  <strong>Nível:</strong>
                  {animalSelecionado.nivel}
                </div>

                <div className="saida-info-box saida-full">
                  <strong>Endereço:</strong>
                  {animalSelecionado.endereco}
                </div>

              </div>

              <div className="saida-modal-buttons">

                <button
                  className="saida-btn-fechar"
                  onClick={() =>
                    setAnimalSelecionado(null)
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