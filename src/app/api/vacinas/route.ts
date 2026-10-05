import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src",
  "data",
  "vacinas.json"
);

export async function GET() {

  try {

    const data =
      await fs.readFile(
        filePath,
        "utf-8"
      );

    return NextResponse.json(
      JSON.parse(data)
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao carregar vacinas"
      },
      { status: 500 }
    );

  }

}

export async function POST(
  request: Request
) {

  try {

    const novaVacina =
      await request.json();

    const data =
      await fs.readFile(
        filePath,
        "utf-8"
      );

    const vacinas =
      JSON.parse(data);

    const vacinaComId = {
      id: Date.now(),
      ...novaVacina
    };

    vacinas.push(vacinaComId);

    await fs.writeFile(
      filePath,
      JSON.stringify(
        vacinas,
        null,
        2
      )
    );

    return NextResponse.json(
      vacinaComId,
      { status: 201 }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao salvar vacina"
      },
      { status: 500 }
    );

  }

}

export async function PUT(
  request: Request
) {

  try {

    const vacinaAtualizada =
      await request.json();

    const data =
      await fs.readFile(
        filePath,
        "utf-8"
      );

    const vacinas =
      JSON.parse(data);

    const indice =
      vacinas.findIndex(
        (vacina: any) =>
          vacina.id === vacinaAtualizada.id
      );

    if (indice === -1) {

      return NextResponse.json(
        {
          error:
            "Vacina não encontrada"
        },
        { status: 404 }
      );

    }

    vacinas[indice] =
      vacinaAtualizada;

    await fs.writeFile(
      filePath,
      JSON.stringify(
        vacinas,
        null,
        2
      )
    );

    return NextResponse.json(
      vacinaAtualizada
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao atualizar vacina"
      },
      { status: 500 }
    );

  }

}

export async function DELETE(
  request: Request
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const id =
      Number(
        searchParams.get("id")
      );

    const data =
      await fs.readFile(
        filePath,
        "utf-8"
      );

    const vacinas =
      JSON.parse(data);

    const vacinasAtualizadas =
      vacinas.filter(
        (vacina: any) =>
          vacina.id !== id
      );

    await fs.writeFile(
      filePath,
      JSON.stringify(
        vacinasAtualizadas,
        null,
        2
      )
    );

    return NextResponse.json({
      mensagem:
        "Vacina removida com sucesso"
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Erro ao excluir vacina"
      },
      {
        status: 500
      }
    );

  }

}