export const runtime = "nodejs";
export const preferredRegion = "iad1";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/**
 * Obtiene Prisma asegurando que DATABASE_URL exista
 */
async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL NO DETECTADA");
    throw new Error("DATABASE_URL no está definida en el entorno de ejecución.");
  }

  console.log("🔍 DATABASE_URL detectada:", process.env.DATABASE_URL.slice(0, 30));

  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const { email, password, nombre, tipoUsuario } = body;

    // Validaciones
    if (!email || !password || !nombre || !tipoUsuario) {
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

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
        nombre: nombre.trim(),
        tipoUsuario,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        tipoUsuario: true,
        fechaRegistro: true,
        isAdmin: true,
      },
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔥 Error creando usuario:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    let errorMessage = "Error al crear el usuario.";

    if (error.code === "P2002") {
      errorMessage = "Este email ya está registrado.";
    } else if (
      error.code === "P1001" ||
      error.message?.includes("Can't reach database server")
    ) {
      errorMessage =
        "Error de conexión con la base de datos. Verifica la configuración.";
    } else if (error.message?.includes("DATABASE_URL")) {
      errorMessage =
        "DATABASE_URL no está configurada correctamente en Vercel.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}