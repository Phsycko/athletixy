import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Forzar ejecución en Node → NECESARIO PARA BCRYPT Y PRISMA EN VERCEL
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Import dinámico de Prisma → evita errores en serverless
async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const { email, password } = body;

    // ---------------------------
    // VALIDACIONES
    // ---------------------------
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos." },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // ---------------------------
    // BUSCAR USUARIO
    // ---------------------------
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    // ---------------------------
    // VALIDAR CONTRASEÑA
    // ---------------------------
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    // ---------------------------
    // NORMALIZAR ROLES DEL SISTEMA
    // ---------------------------
    let roleFinal = user.tipoUsuario;

    if (user.tipoUsuario === "gym") {
      roleFinal = "GYM_MANAGER"; // tu sistema lo usa internamente así
    }

    // ---------------------------
    // RESPUESTA FINAL
    // ---------------------------
    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          tipoUsuario: user.tipoUsuario,
          role: roleFinal,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Error en login:", {
      message: error.message,
      code: error.code,
    });

    return NextResponse.json(
      {
        error: "Error al iniciar sesión. Intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}
