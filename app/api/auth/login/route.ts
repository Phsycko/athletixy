import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        tipoUsuario: true,
        gymManagerId: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 🔥 NORMALIZACIÓN REAL DEL ROL
    let roleFinal = user.tipoUsuario; // valor exacto de BD

    // Si es coach y tiene gymManagerId, es un coach interno
    if (roleFinal === "coach" && user.gymManagerId) {
      roleFinal = "COACH_INTERNO";
    } else if (roleFinal === "gym") {
      roleFinal = "GYM_MANAGER";
    }

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          role: roleFinal,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}