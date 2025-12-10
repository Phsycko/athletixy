import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida en el entorno de ejecución.");
  }
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
      return NextResponse.json(
        { error: "coachId es requerido" },
        { status: 400 }
      );
    }

    // Buscar el coach en la base de datos
    const coach = await prisma.user.findUnique({
      where: { id: coachId },
      select: {
        id: true,
        email: true,
        nombre: true,
        tipoUsuario: true,
        gymManagerId: true,
        fechaRegistro: true,
        isAdmin: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que sea un coach interno
    if (coach.tipoUsuario !== "coach" || !coach.gymManagerId) {
      return NextResponse.json(
        { error: "No es un coach interno válido" },
        { status: 403 }
      );
    }

    return NextResponse.json({ coach }, { status: 200 });
  } catch (error: any) {
    console.error("Error obteniendo datos del coach:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del coach" },
      { status: 500 }
    );
  }
}

