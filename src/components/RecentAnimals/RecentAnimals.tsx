"use client";

import "./RecentAnimals.css";

export default function RecentAnimals() {
  const animals = [
    {
      nome: "Thor",
      tipo: "Cachorro",
      entrada: "10/05/2026",
      status: "Disponível",
    },

    {
      nome: "Mia",
      tipo: "Gato",
      entrada: "09/05/2026",
      status: "Tratamento",
    },

    {
      nome: "Bob",
      tipo: "Cachorro",
      entrada: "08/05/2026",
      status: "Adoção",
    },
  ];

  return (
    <section className="recent-panel">

      <h2>Últimos Animais Cadastrados</h2>

      <table>

        <thead>

          <tr>

            <th>Nome</th>

            <th>Tipo</th>

            <th>Entrada</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {animals.map((animal, index) => (
            <tr key={index}>

              <td>{animal.nome}</td>

              <td>{animal.tipo}</td>

              <td>{animal.entrada}</td>

              <td>
                <span className="status">
                  {animal.status}
                </span>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </section>
  );
}