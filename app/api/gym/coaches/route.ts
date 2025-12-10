import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
    const gymManagerId = searchParams.get("gymManagerId");

    if (!gymManagerId) {
      return NextResponse.json(
        { error: "gymManagerId es requerido" },
        { status: 400 }
      );
    }

    // Obtener todos los coaches internos del gym manager
    const coaches = await prisma.user.findMany({
      where: {
        tipoUsuario: "coach",
        gymManagerId: gymManagerId,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        tipoUsuario: true,
        gymManagerId: true,
        fechaRegistro: true,
        isAdmin: true,
      },
      orderBy: {
        fechaRegistro: "desc",
      },
    });

    return NextResponse.json(
      { coaches },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error obteniendo coaches:", {
      message: error.message,
      code: error.code,
    });

    return NextResponse.json(
      { error: "Error al obtener los coaches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const { nombre, email, password, gymManagerId } = body;

    // Validaciones
    if (!nombre || !email || !password || !gymManagerId) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear coach interno CORREGIDO 🔥🔥🔥
    const newCoach = await prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
        nombre: nombre.trim(),
        tipoUsuario: "COACH_INTERNO", // 👈🔥 AQUÍ ESTABA EL ERROR
        gymManagerId: gymManagerId,
        isAdmin: false,
      },
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

    return NextResponse.json(
      {
        message: "Coach interno creado exitosamente",
        user: newCoach,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creando coach interno:", {
      message: error.message,
      code: error.code,
    });

    let errorMessage = "Error al crear el coach interno";

    if (error.code === "P2002") {
      errorMessage = "Este email ya está registrado";
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