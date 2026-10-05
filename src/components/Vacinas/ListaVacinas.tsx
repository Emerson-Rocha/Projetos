"use client";


import "./ListaVacinas.css";
import Titulo from "@/components/UI/Titulo/Titulo";
import { useRouter } from "next/navigation";

import {
  useState,
  useEffect
} from "react";

import { Vacina }
  from "@/types/vacina";

export default function ListaVacinas() {

  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [tipoFiltro, setTipoFiltro] =
    useState("");

  const [especieFiltro,
    setEspecieFiltro] =
    useState("");

  const [
    vacinaSelecionada,   setVacinaSelecionada ] = useState<Vacina | null>(null);
  const [vacinas, setVacinas] =  useState<Vacina[]>([]);

  const filteredVacinas =

    vacinas.filter((vacina) => {

      const termo =
        search.toLowerCase();

      const matchSearch =
        vacina.nome
          .toLowerCase()
          .includes(termo) ||

        vacina.fabricante
          .toLowerCase()
          .includes(termo) ||

        vacina.lote
          .toLowerCase()
          .includes(termo);

      const matchTipo =
        tipoFiltro === "" ||
        vacina.tipo === tipoFiltro;

      const matchEspecie =
        especieFiltro === "" ||
        vacina.especie === especieFiltro;

      return (
        matchSearch &&
        matchTipo &&
        matchEspecie
      );
    });



  function getStatusClass(status: string) {

    switch (status) {

      case "ok":
        return "status-ok";

      case "baixo":
        return "status-baixo";

      case "vencendo":
        return "status-vencendo";

      case "vencida":
        return "status-vencida";

      default:
        return "";
    }
  }



  function getStatusText(status: string) {

    switch (status) {

      case "ok":
        return "Em Estoque";

      case "baixo":
        return "Estoque Baixo";

      case "vencendo":
        return "Vencendo";

      case "vencida":
        return "Vencida";

      default:
        return status;
    }
  }

  function calcularStatus(vacina: Vacina) {

    const hoje =
      new Date();

    const validade =
      new Date(vacina.validade);

    const diferencaDias =
      Math.ceil(
        (
          validade.getTime() -
          hoje.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      );

    // vencida
    if (diferencaDias < 0) {
      return "vencida";
    }

    // vence em até 30 dias
    if (diferencaDias <= 30) {
      return "vencendo";
    }

    // estoque baixo
    if (vacina.quantidade <= 5) {
      return "baixo";
    }

    return "ok";
  }

  async function excluirVacina(
    id: number
  ) {

    const confirmar =
      window.confirm(
        "Deseja realmente excluir esta vacina?"
      );

    if (!confirmar) {
      return;
    }

    try {

      const response =
        await fetch(
          `/api/vacinas?id=${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        throw new Error(
          "Erro ao excluir"
        );

      }

      setVacinas(
        vacinas.filter(
          vacina =>
            vacina.id !== id
        )
      );

      setVacinaSelecionada(null);

      alert(
        "Vacina excluída com sucesso!"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao excluir vacina"
      );

    }

  }

 

  async function carregarVacinas() {

    try {

      const response =
        await fetch(
          "/api/vacinas"
        );

      const data =
        await response.json();

      setVacinas(data);

    } catch (error) {

      console.error(
        "Erro ao carregar vacinas:",
        error
      );

    }

  }

  //==============================Mudanças =====================

  const [qtdVacina, setQtdVacina]= useState<number>(0);
  


  const url: string = "http://localhost:3010";
     
  //===================== QUANTIDADE DE VACINAS ================
  async function totalVacina(url: string) {
    try {
      const caminho = url + "/qtdvacinas";
      await fetch(caminho)
        .then((resp) => resp.json())
        .then((data) => setQtdVacina(data.qtd))

    } catch (e) {
          console.log(`erro:${e}`);
    }
  }

  //===================== LISTE  VACINAS =======================
async function exibaVacina(url: string) {
    try {
      const caminho = url + "/vacinas";
      await fetch(caminho)
        .then((resp) => resp.json())
        .then((data) => setVacinas(data))

    } catch (e) {
          console.log(`erro:${e}`);
    }
  }



 useEffect(() => {
     totalVacina( url);
     exibaVacina(url);
   // carregarVacinas();

  }, []);

  return (
    <section className="lista-container">

      <Titulo
        titulo="Lista de Vacinas"
        descricao="Gerencie lotes, estoque e validade das vacinas cadastradas."
      />



      {/* CARDS */}

      <div className="cards-grid">

        <div className="info-card">

          <h3>Total de Vacinas</h3>

          <span>
            {qtdVacina}
          </span>

        </div>

        <div className="info-card">

          <h3>
            Total de Doses
          </h3>

          <span>

            {
              vacinas.reduce(
                (total, vacina) =>
                  total + vacina.quantidade,
                0
              )
            }

          </span>

        </div>

        <div className="info-card">

          <h3>Estoque Baixo</h3>

          <span>
            {
              vacinas.filter(
                vacina =>
                  calcularStatus(vacina) === "baixo"
              ).length
            }
          </span>

        </div>

        <div className="info-card">

          <h3>Vencendo</h3>

          <span>
            {
              vacinas.filter(
                vacina =>
                  calcularStatus(vacina) === "vencendo"
              ).length
            }
          </span>

        </div>

        <div className="info-card">

          <h3>Vencidas</h3>

          <span>
            {
              vacinas.filter(
                vacina =>
                  calcularStatus(vacina) === "vencida"
              ).length
            }
          </span>

        </div>

      </div>



      {/* FILTROS */}

      <div className="filtro-container">

        <input
          type="text"
          placeholder="Buscar vacina, fabricante ou lote..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={tipoFiltro}
          onChange={(e) =>
            setTipoFiltro(e.target.value)
          }
        >

          <option value="">
            Todos os tipos
          </option>

          <option value="V8">
            V8
          </option>

          <option value="V10">
            V10
          </option>

          <option value="Antirrábica">
            Antirrábica
          </option>

          <option value="V4">
            V4
          </option>

          <option value="V3">
            V3
          </option>

        </select>



        <select
          value={especieFiltro}
          onChange={(e) =>
            setEspecieFiltro(
              e.target.value
            )
          }
        >

          <option value="">
            Todas as espécies
          </option>

          <option value="Cão">
            Cão
          </option>

          <option value="Gato">
            Gato
          </option>

          <option value="Ambos">
            Ambos
          </option>

        </select>

      </div>



      {/* TABELA */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Vacina</th>

              <th>Tipo</th>

              <th>Espécie</th>

              <th>Fabricante</th>

              <th>Lote</th>

              <th>Validade</th>

              <th>Quantidade</th>

              <th>Status</th>

              <th>Ações</th>

            </tr>

          </thead>

          <tbody>




            {filteredVacinas.map((vacina) => (

              <tr
                key={vacina.id_vacina}
                className={
                  calcularStatus(vacina)
                }
              >

                <td>{vacina.nome}</td>

                <td>{vacina.tipo}</td>

                <td>{vacina.especie}</td>

                <td>{vacina.fabricante}</td>

                <td>{vacina.lote}</td>

                <td>{vacina.validade}</td>

                <td>{vacina.quantidade}</td>

                <td>

                  <span
                    className={
                      `status-badge
                    ${getStatusClass(
                        calcularStatus(vacina)
                      )}`
                    }
                  >

                    {getStatusText(
                      calcularStatus(vacina)
                    )}

                  </span>

                </td>

                <td>

                  <div className="acoes">

                    <button
                      onClick={() =>
                        setVacinaSelecionada(vacina)
                      }
                    >
                      Detalhes
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      {/* MODAL */}

      {vacinaSelecionada && (

        <div
          className="modal-overlay"
          onClick={() =>
            setVacinaSelecionada(null)
          }
        >

          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              Detalhes da Vacina
            </h2>

            <div className="detalhes-grid">

              <p>
                <strong>Nome:</strong>
                {" "}
                {vacinaSelecionada.nome}
              </p>

              <p>
                <strong>Tipo:</strong>
                {" "}
                {vacinaSelecionada.tipo}
              </p>

              <p>
                <strong>Espécie:</strong>
                {" "}
                {vacinaSelecionada.especie}
              </p>

              <p>
                <strong>Fabricante:</strong>
                {" "}
                {vacinaSelecionada.fabricante}
              </p>

              <p>
                <strong>Lote:</strong>
                {" "}
                {vacinaSelecionada.lote}
              </p>

              <p>
                <strong>
                  Data de Fabricação:
                </strong>
                {" "}
                {
                  vacinaSelecionada.dataFabricacao
                }
              </p>

              <p>
                <strong>Validade:</strong>
                {" "}
                {vacinaSelecionada.validade}
              </p>

              <p>
                <strong>Quantidade:</strong>
                {" "}
                {vacinaSelecionada.quantidade}
              </p>

              <p>
                <strong>Status:</strong>
                {" "}
                {getStatusText(
                  calcularStatus(
                    vacinaSelecionada
                  )
                )}
              </p>

              <p>
                <strong>Fornecedor:</strong>{" "}
                {vacinaSelecionada.fornecedor}
              </p>

              <p>
                <strong>Responsável:</strong>{" "}
                {vacinaSelecionada.responsavel}
              </p>

              <p>
                <strong>Data de Entrada:</strong>{" "}
                {vacinaSelecionada.dataEntrada}
              </p>

              <p>
                <strong>Nota Fiscal:</strong>{" "}
                {vacinaSelecionada.notaFiscal}
              </p>

              <p>
                <strong>Valor Unitário:</strong>{" "}
                R$ {vacinaSelecionada.valorUnitario}
              </p>

              <p>
                <strong>Valor Total:</strong>{" "}
                R$ {vacinaSelecionada.valorTotal}
              </p>

              <p>
                <strong>Temperatura:</strong>{" "}
                {vacinaSelecionada.temperatura}
              </p>

              <p>
                <strong>Armazenamento:</strong>{" "}
                {vacinaSelecionada.localArmazenamento}
              </p>

            </div>

            <div className="modal-actions">

              <button
                className="editar-btn"
                onClick={() => {

                  router.push(
                    `/cadastro-vacinas?id=${vacinaSelecionada.id}`
                  );

                }}
              >
                Editar
              </button>

              <button
                className="excluir-btn"
                onClick={() =>
                  excluirVacina(
                    vacinaSelecionada.id
                  )
                }
              >
                Excluir
              </button>

              <button
                className="fechar-modal"
                onClick={() =>
                  setVacinaSelecionada(null)
                }
              >
                Fechar
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}