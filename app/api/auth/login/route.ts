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

    // Normalizar el rol
    let roleFinal = user.tipoUsuario;
    if (roleFinal === "ATHLETE_INTERNO") {
      roleFinal = "ATHLETE_INTERNO";
    } else if (roleFinal === "coach" && user.gymManagerId) {
      roleFinal = "COACH_INTERNO";
    } else if (roleFinal === "gym") {
      roleFinal = "GYM_MANAGER";
    }

    const sessionData = {
      loggedIn: true,
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      role: roleFinal,
      gymManagerId: user.gymManagerId || null,
    };

    return NextResponse.json({
      message: "Login exitoso",
      user: sessionData,
      session: sessionData,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}