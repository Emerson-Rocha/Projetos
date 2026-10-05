"use client";
import "./CadastroAnimais.css";
import "../cadastro-vacinas/CadastroVacinaForm.css";
import Layout from "@/components/Layout/Layout";
import Titulo from "@/components/UI/Titulo/Titulo";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Vacina } from "@/types/vacina";


//=============================================
const racasCaes = [
  "Sem raça definida",
  "Labrador",
  "Poodle",
  "Pinscher",
  "Shih Tzu",
  "Pastor Alemão",
  "Golden Retriever",
  "Bulldog",
  "Vira-lata",
];

const racasGatos = [
  "Sem raça definida",
  "Siamês",
  "Persa",
  "Maine Coon",
  "Angorá",
  "Sphynx",
  "Ragdoll",
  "Vira-lata",
];
//=============================================


function normalizarEspecie(especie: string) {
  return especie
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


function vacinaServeParaAnimal(
  especieVacina: string,
  tipoAnimal: string
) {
  const especie = normalizarEspecie(especieVacina);
  const animal = normalizarEspecie(tipoAnimal);

  return especie === animal || especie === "ambos";
}

function converterArquivoParaBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject("Erro ao carregar imagem");
    };

    reader.readAsDataURL(file);
  });
}

const comandosOpcoes = [
  "Sentar",
  "Ficar",
  "Deitar",
  "Rolar",
  "Dar a pata",
  "Vir quando chamado",
  "Andar junto",
];
//======================================

//=============== https://www.npmjs.com/package/yup ==================
const animalSchema = Yup.object({
  nome: Yup.string()
    .required("Informe o nome do animal")
    .min(2, "Nome muito curto"),

  rg: Yup.string().required("Informe o RG do animal"),

  tipo: Yup.string().required("Informe o tipo do animal"),

  porte: Yup.string().required("Informe o porte do animal"),

  raca: Yup.string().required("Informe a raça do animal"),

  idade: Yup.string().required("Informe a idade real ou aproximada"),

  sexo: Yup.string().required("Informe o sexo do animal"),

  causaFalecimento: Yup.string().when("status", {
    is: "falecido",
    then: schema => schema.required("Informe a causa do falecimento"),
    otherwise: schema => schema,
  }),

  dataFalecimento: Yup.string().when("status", {
    is: "falecido",
    then: schema => schema.required("Informe a data do falecimento"),
    otherwise: schema => schema,
  }),
});

//===================================================================


const valoresIniciais = {
  nome: "",
  rg: "",
  tipo: "",
  porte: "",
  raca: "",
  idade: "",
  sexo: "",
  status: "indisponivel",

  foto1: "",
  foto2: "",
  foto3: "",
  fotoPrincipal: 0,

  castrado: false,
  vermifugado: false,
  vacinado: false,
  vacinas: [] as string[],
  observacoesProntuario: "",

  comandos: [] as string[],
  observacoesAdestramento: "",

  causaFalecimento: "",
  dataFalecimento: "",
};

export default function CadastroAnimais() {

  const searchParams = useSearchParams();
  const router = useRouter();




  //============   * (PROFESSOR)================================ 
  const [arquivosFotos, setArquivosFotos] = useState<File[]>([]);
  //=============================================================





  const animalId = searchParams.get("id");
  const modoEdicao = animalId !== null;
  const [dadosIniciais, setDadosIniciais] = useState(valoresIniciais);
  const [animalFalecido, setAnimalFalecido] = useState(false);
  const [vacinasCadastradas, setVacinasCadastradas] = useState<Vacina[]>([]);

  useEffect(() => {
    async function carregarVacinas() {
      try {
        const response = await fetch("/api/vacinas");
        const vacinas = await response.json();
        setVacinasCadastradas(vacinas);
      } catch (error) {
        console.error(error);
      }
    }

    carregarVacinas();
  }, []);

  useEffect(() => {
    if (!modoEdicao) {
      return;
    }
    //=========================================
    async function carregarAnimal() {
      try {
        const response = await fetch("/api/animais");
        const animais = await response.json();

        const animal = animais.find(
          (item: any) => item.id === Number(animalId)
        );

        if (!animal) {
          return;
        }

        setAnimalFalecido(animal.status === "falecido");

        setDadosIniciais({
          nome: animal.nome || "",
          rg: animal.rg || "",
          tipo: animal.tipo || "",
          porte: animal.porte || "",
          raca: animal.raca || "",
          idade: animal.idade || "",
          sexo: animal.sexo || "",
          status: animal.status || "indisponivel",

          foto1: animal.fotos?.[0] || "",
          foto2: animal.fotos?.[1] || "",
          foto3: animal.fotos?.[2] || "",
          fotoPrincipal: animal.fotoPrincipal || "",

          castrado: animal.prontuario?.castrado || false,
          vermifugado: animal.prontuario?.vermifugado || false,
          vacinado: animal.prontuario?.vacinado || false,
          vacinas: animal.prontuario?.vacinas || [],
          observacoesProntuario: animal.prontuario?.observacoes || "",

          comandos: animal.adestramento?.comandos || [],
          observacoesAdestramento: animal.adestramento?.observacoes || "",

          causaFalecimento: animal.falecimento?.causa || "",
          dataFalecimento: animal.falecimento?.data || "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    carregarAnimal();
  }, [modoEdicao, animalId]);
  //=========================================
  return (
    <Layout>
      <section className="animal-container">
        <Titulo
          titulo={modoEdicao ? "Editar Animal" : "Cadastro de Animais"}
          descricao="Cadastre animais, prontuário, fotos e informações de adestramento."
        />

        {animalFalecido && (
          <div className="form-card-aviso">
            <strong>Atenção:</strong> este animal está com status Falecido. O
            perfil fica disponível apenas para visualização e não pode mais ser
            alterado.
          </div>
        )}

        <Formik
          initialValues={dadosIniciais}
          enableReinitialize
          validationSchema={animalSchema}
          onSubmit={
            async (values, { resetForm }) => {
              if (animalFalecido) {
                alert("Animal falecido não pode ser alterado.");
                return;
              }



              // =========  *(PROFESSOR)USAR CLASSE ==================
              // CRIAR FORMDATA
              // ==========================================

              const formData = new FormData();

              formData.append("nome", values.nome);
              formData.append("rg", values.rg);
              formData.append("tipo", values.tipo);
              formData.append("porte", values.porte);
              formData.append("raca", values.raca);
              formData.append("idade", values.idade);
              formData.append("sexo", values.sexo);
              formData.append("status", values.status);
              formData.append("fotoPrincipal", String(values.fotoPrincipal)
              );

              // ==========*(PROFESSOR)===================
              // FOTOS
              // ==========================================

              arquivosFotos.forEach((arquivo) => {

                formData.append("fotos", arquivo);

              });

              //===============================================

              try {
                const fotos = [
                  values.foto1,
                  values.foto2,
                  values.foto3,
                ].filter(foto => foto.trim() !== "")
                  .map(foto => {
                    return new URL(foto).pathname;
                  });

                const fotoPrincipal = values.fotoPrincipal || fotos[0] || "";


                // ===== * (PROFESSOR )TIREI ESTA PARTE DEVIDO A CLASSE FORMDATA
                /*  const body = {
                   id: modoEdicao ? Number(animalId) : undefined,
                   nome: values.nome,
                   rg: values.rg,
                   tipo: values.tipo,
                   porte: values.porte,
                   raca: values.raca,
                   idade: values.idade,
                   sexo: values.sexo,
                   status: values.status,
                   fotos,
                   fotoPrincipal,
                   prontuario: {
                     castrado: values.castrado,
                     vermifugado: values.vermifugado,
                     vacinado: values.vacinado,
                     vacinas: values.vacinas,
                     observacoes: values.observacoesProntuario,
                   },
                   adestramento: {
                     comandos: values.comandos,
                     observacoes: values.observacoesAdestramento,
                   },
                   falecimento:
                     values.status === "falecido"
                       ? {
                         causa: values.causaFalecimento,
                         data: values.dataFalecimento,
                       }
                       : undefined,
                 };
   
    */

                // const body = {
                //   id: modoEdicao ? Number(animalId) : undefined,
                //   nome: values.nome,
                //   rg: values.rg,
                //   tipo: values.tipo,
                //   porte: values.porte,
                //   raca: values.raca,
                //   idade: values.idade,
                //   sexo: values.sexo,
                //   status: values.status,
                //   fotos

                // };


                //=== *( PROFESSOR)
                // fazer url para mandar para api
                const url = modoEdicao ? "http://localhost:3010/UPDATE" : "http://localhost:3010/INSERT";


                const response = await fetch(url, {
                  method: modoEdicao ? "PUT" : "POST",

                  // TIREI ESTA PARA DEFIDO DO FORMDATA
                  // headers: {
                  //   "Content-Type": "application/json",
                  // },
                  // body: JSON.stringify(body),
                  body: formData
                });


                if (!response.ok) {
                  throw new Error("Erro ao salvar animal");
                }

                alert(
                  modoEdicao
                    ? "Animal atualizado com sucesso!"
                    : "Animal cadastrado com sucesso!"
                );


                if (modoEdicao) {
                  router.push("/lista-animais");
                  return;
                }

                resetForm();
              } catch (error) {
                console.error(error);
                alert("Erro ao salvar animal.");
              }
            }}
        >


          {/* //=================================  */}


          {({ values, setFieldValue }) => {
            const racas =
              values.tipo === "cao"
                ? racasCaes
                : values.tipo === "gato"
                  ? racasGatos
                  : [];

            const camposDesativados = animalFalecido;

            const vacinasFiltradas =
              values.tipo === ""
                ? []
                : vacinasCadastradas.filter(vacina =>
                  vacinaServeParaAnimal(vacina.especie, values.tipo)
                );

            //===== *(PROFESSSOR) TIREI ESTÁ PARTE ====================

            /* const fotosSelecionadas = [
              values.foto1,
              values.foto2,
              values.foto3,
            ].filter(foto => foto.trim() !== "");
 */
          //========================================================
          
            const fotosSelecionadas = [
              values.foto1,
              values.foto2,
              values.foto3,
            ].filter(foto => foto && foto.trim() !== "");


            return (
              <Form className="animal-form">
                <div className="form-card">
                  <h2>Informações do Animal</h2>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome do Animal</label>
                      <Field
                        name="nome"
                        type="text"
                        disabled={camposDesativados}
                      />
                      <ErrorMessage
                        name="nome"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>RG do Animal</label>
                      <Field
                        name="rg"
                        type="text"
                        disabled={camposDesativados}
                      />
                      <ErrorMessage
                        name="rg"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tipo</label>
                      <Field
                        as="select"
                        name="tipo"
                        disabled={camposDesativados}
                        onChange={(e: any) => {
                          setFieldValue("tipo", e.target.value);
                          setFieldValue("raca", "");
                          setFieldValue("vacinas", []);
                          setFieldValue("vacinado", false);
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="cao">Cão</option>
                        <option value="gato">Gato</option>
                      </Field>
                      <ErrorMessage
                        name="tipo"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Porte</label>
                      <Field
                        as="select"
                        name="porte"
                        disabled={camposDesativados}
                      >
                        <option value="">Selecione</option>
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                      </Field>
                      <ErrorMessage
                        name="porte"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Raça</label>
                      <Field
                        as="select"
                        name="raca"
                        disabled={camposDesativados || values.tipo === ""}
                      >
                        <option value="">
                          {values.tipo === ""
                            ? "Selecione o tipo primeiro"
                            : "Selecione"}
                        </option>

                        {racas.map(raca => (
                          <option key={raca} value={raca}>
                            {raca}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="raca"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Idade</label>
                      <Field
                        name="idade"
                        type="text"
                        placeholder="Ex: 2 anos ou aproximadamente 6 meses"
                        disabled={camposDesativados}
                      />
                      <ErrorMessage
                        name="idade"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    <div className="form-group">
                      <label>Sexo</label>
                      <Field
                        as="select"
                        name="sexo"
                        disabled={camposDesativados}
                      >
                        <option value="">Selecione</option>
                        <option value="macho">Macho</option>
                        <option value="femea">Fêmea</option>
                      </Field>
                      <ErrorMessage
                        name="sexo"
                        component="span"
                        className="error-message"
                      />
                    </div>

                    {modoEdicao && (
                      <div className="form-group">
                        <label>Status</label>
                        <Field
                          as="select"
                          name="status"
                          disabled={camposDesativados}
                        >
                          <option value="indisponivel">Indisponível</option>
                          <option value="disponivel">Disponível</option>
                          <option value="passeando">Passeando</option>
                          <option value="festa_pijama">Festa do Pijama</option>
                          <option value="adotado">Adotado</option>
                          <option value="falecido">Falecido</option>
                        </Field>
                      </div>
                    )}
                  </div>

                  {!modoEdicao && (
                    <p className="status-info full-width">
                      Todo animal novo será cadastrado inicialmente como
                      Indisponível, até ser liberado pelo responsável.
                    </p>
                  )}
                </div>

                <div className="form-card">
                  <h2>Fotos do Animal</h2>

                  <div className="form-group full-width">
                    <label>Selecionar fotos</label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={camposDesativados}
                      onChange={async event => {
                        const arquivos = Array.from(
                          event.currentTarget.files || []
                        ).slice(0, 3);

                        if (arquivos.length === 0) {
                          return;
                        }

                        // Guarda os arquivos reais
                        setArquivosFotos(arquivos);

                        // Cria URLs temporárias somente para o preview
                        const urls = arquivos.map(arquivo =>
                          URL.createObjectURL(arquivo)
                        );

                        setFieldValue("foto1", urls[0] || "");
                        setFieldValue("foto2", urls[1] || "");
                        setFieldValue("foto3", urls[2] || "");
                        setFieldValue("fotoPrincipal", 0);

                        console.log(arquivos[0].name);
                        console.log(arquivos[0].type);
                        // try {
                        //   const imagensConvertidas = await Promise.all(
                        //     // arquivos.map(arquivo =>
                        //     //   converterArquivoParaBase64(arquivo)
                        //     // )
                        //   );

                        //   setFieldValue("foto1", imagensConvertidas[0] || "");
                        //   setFieldValue("foto2", imagensConvertidas[1] || "");
                        //   setFieldValue("foto3", imagensConvertidas[2] || "");
                        //   setFieldValue(
                        //     "fotoPrincipal",
                        //     imagensConvertidas[0] || ""
                        //   );
                        // } catch (error) {
                        //   console.error(error);
                        //   alert("Erro ao carregar imagem.");
                        // }
                      }}
                    />

                    <p className="status-info">
                      Selecione até 3 fotos do animal. A primeira foto será
                      usada como principal, mas você pode alterar abaixo.
                    </p>
                  </div>

                  {fotosSelecionadas.length > 0 && (
                    <div className="form-group full-width">
                      <label>Escolha a foto principal</label>

                      <div className="checkbox-list">
                        {fotosSelecionadas.map((foto, index) => (
                          <label className="checkbox-item" key={foto}>
                            <Field
                              type="radio"
                              name="fotoPrincipal"
                              value={String(index)}
                              index={index}
                              disabled={camposDesativados}
                            />
                            Foto {index + 1}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {fotosSelecionadas.length > 0 && (
                    <div className="fotos-preview-lista">
                      {fotosSelecionadas.map((foto, index) => (
                        <div className="foto-preview-item" key={foto}>
                          <img
                            src={foto}
                            alt={`Prévia da foto ${index + 1}`}
                          />

                          <span>
                            {Number(values.fotoPrincipal) === index
                              ? "Foto principal"
                              : `Foto ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-card">
                  <h2>Prontuário</h2>

                  {/*=============== CHEKBOX ================*/}
                  <div className="checkbox-list">

                    <label className="checkbox-item">
                      <Field
                        type="checkbox"
                        name="castrado"
                        disabled={camposDesativados}
                      />
                      Castrado
                    </label>

                    <label className="checkbox-item">
                      <Field
                        type="checkbox"
                        name="vermifugado"
                        disabled={camposDesativados}
                      />
                      Vermifugado
                    </label>

                    <label className="checkbox-item">
                      <Field
                        type="checkbox"
                        name="vacinado"
                        disabled={camposDesativados}
                      />
                      Vacinado
                    </label>

                    {/*=============== FIM CHEKBOX ================*/}
                  </div>

                  <div className="form-group full-width">
                    <label>Vacinas Aplicadas</label>

                    {values.tipo === "" && (
                      <p className="status-info">
                        Selecione primeiro o tipo do animal para visualizar as
                        vacinas compatíveis.
                      </p>
                    )}

                    {values.tipo !== "" && vacinasFiltradas.length === 0 && (
                      <p className="status-info">
                        Nenhuma vacina compatível cadastrada para esta espécie.
                        Cadastre primeiro em Cadastro de Vacinas.
                      </p>
                    )}

                    {vacinasFiltradas.length > 0 && (
                      <div className="checkbox-list">
                        {vacinasFiltradas.map(vacina => {
                          const valorVacina = `${vacina.nome} | Lote: ${vacina.lote || "sem lote"
                            }`;

                          return (
                            <label className="checkbox-item" key={vacina.id}>
                              <Field
                                type="checkbox"
                                name="vacinas"
                                value={valorVacina}
                                disabled={camposDesativados}
                              />
                              {vacina.nome}
                              {vacina.tipo && (
                                <span className="vacina-detalhe">
                                  {vacina.tipo}
                                </span>
                              )}
                              {vacina.especie && (
                                <span className="vacina-detalhe">
                                  {normalizarEspecie(vacina.especie) ===
                                    "ambos"
                                    ? "Cão e gato"
                                    : normalizarEspecie(vacina.especie) ===
                                      "cao"
                                      ? "Cão"
                                      : "Gato"}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Observações do Prontuário</label>
                    <Field
                      as="textarea"
                      name="observacoesProntuario"
                      disabled={camposDesativados}
                    />
                  </div>
                </div>

                <div className="form-card">
                  <h2>Adestramento</h2>

                  <div className="form-group">
                    <label>Comandos que atende</label>
                    <div className="checkbox-list">
                      {comandosOpcoes.map(comando => (
                        <label className="checkbox-item" key={comando}>
                          <Field
                            type="checkbox"
                            name="comandos"
                            value={comando}
                            disabled={camposDesativados}
                          />
                          {comando}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Observações de Adestramento</label>
                    <Field
                      as="textarea"
                      name="observacoesAdestramento"
                      disabled={camposDesativados}
                    />
                  </div>
                </div>

                {values.status === "falecido" && (
                  <div className="form-card">
                    <h2>Registro de Falecimento</h2>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Causa da morte</label>
                        <Field
                          name="causaFalecimento"
                          type="text"
                          disabled={camposDesativados}
                        />
                        <ErrorMessage
                          name="causaFalecimento"
                          component="span"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label>Data do falecimento</label>
                        <Field
                          name="dataFalecimento"
                          type="date"
                          disabled={camposDesativados}
                        />
                        <ErrorMessage
                          name="dataFalecimento"
                          component="span"
                          className="error-message"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!animalFalecido && (
                  <div className="submit-area">
                    <button type="submit">
                      {modoEdicao ? "Salvar Alterações" : "Cadastrar Animal"}
                    </button>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </section>
    </Layout>
  );
}