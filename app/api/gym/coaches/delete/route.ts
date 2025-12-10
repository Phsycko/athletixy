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

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const { coachId } = body;

    if (!coachId) {
      return NextResponse.json(
        { error: "coachId es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el coach existe
    const coach = await prisma.user.findUnique({
      where: { id: coachId },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que sea un coach interno (tiene gymManagerId y tipoUsuario es "coach")
    if (!coach.gymManagerId || coach.tipoUsuario !== "coach") {
      return NextResponse.json(
        { error: "Este usuario no es un coach interno" },
        { status: 403 }
      );
    }

    // Eliminar el coach de la base de datos
    await prisma.user.delete({
      where: { id: coachId },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error eliminando coach:", {
      message: error.message,
      code: error.code,
    });

    let errorMessage = "Error al eliminar el coach";

    if (error.code === "P2025") {
      errorMessage = "Coach no encontrado";
    } else if (
      error.code === "P1001" ||
      error.message?.includes("Can't reach database server")
    ) {
      errorMessage =
        "Error de conexión con la base de datos. Verifica la configuración.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

