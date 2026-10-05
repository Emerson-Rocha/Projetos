import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src",
  "data",
  "animais.json"
);

async function lerAnimais() {
  const data = await fs.readFile(
    filePath,
    "utf-8"
  );

  return JSON.parse(data);
}

async function salvarAnimais(animais: any[]) {
  await fs.writeFile(
    filePath,
    JSON.stringify(animais, null, 2)
  );
}

export async function GET() {
  try {
    const animais = await lerAnimais();

    return NextResponse.json(animais);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao carregar animais",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const novoAnimal = await request.json();
    const animais = await lerAnimais();

    const animalComId = {
      id: Date.now(),
      ...novoAnimal,
      status: novoAnimal.status || "indisponivel",
      criadoEm: new Date().toISOString(),
    };

    animais.push(animalComId);

    await salvarAnimais(animais);

    return NextResponse.json(
      animalComId,
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao cadastrar animal",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const animalAtualizado = await request.json();
    const animais = await lerAnimais();

    const indice = animais.findIndex(
      (animal: any) =>
        animal.id === animalAtualizado.id
    );

    if (indice === -1) {
      return NextResponse.json(
        {
          error: "Animal não encontrado",
        },
        { status: 404 }
      );
    }

    if (animais[indice].status === "falecido") {
      return NextResponse.json(
        {
          error:
            "Animal falecido não pode ser alterado",
        },
        { status: 403 }
      );
    }

    animais[indice] = {
      ...animais[indice],
      ...animalAtualizado,
      atualizadoEm: new Date().toISOString(),
    };

    await salvarAnimais(animais);

    return NextResponse.json(animais[indice]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao atualizar animal",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const id = Number(searchParams.get("id"));
    const master = searchParams.get("master");

    if (master !== "true") {
      return NextResponse.json(
        {
          error:
            "Somente usuário master pode excluir animais",
        },
        { status: 403 }
      );
    }

    const animais = await lerAnimais();

    const animaisAtualizados = animais.filter(
      (animal: any) => animal.id !== id
    );

    await salvarAnimais(animaisAtualizados);

    return NextResponse.json({
      mensagem: "Animal removido com sucesso",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao excluir animal",
      },
      { status: 500 }
    );
  }
}
