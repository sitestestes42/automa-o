import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed mínimo para a Fase 1: cria uma empresa de exemplo apenas
 * para validar que o schema e a conexão com o banco funcionam.
 * A partir da Fase 2, o cadastro real de empresas passa a ser
 * feito pelo dashboard, não por este script.
 */
async function main() {
  const empresaExistente = await prisma.empresa.findFirst({
    where: { nome: "Empresa de Teste (seed)" },
  });

  if (empresaExistente) {
    console.log("Empresa de teste já existe, nada a fazer.");
    return;
  }

  const empresa = await prisma.empresa.create({
    data: {
      nome: "Empresa de Teste (seed)",
      responsavel: "Responsável Teste",
      segmento: "Serviços",
      cidade: "São Paulo",
      estado: "SP",
      descricao: "Empresa criada pelo script de seed para validar a Fase 1.",
    },
  });

  console.log("Empresa de teste criada:", empresa.id);
}

main()
  .catch((error) => {
    console.error("Erro ao rodar o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
