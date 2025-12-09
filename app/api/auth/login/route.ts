import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Cargar Prisma sólo cuando se necesite
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

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // Buscar usuario en la tabla User por email
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Comparar contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 🚀 Aquí enviamos toda la información CORRECTA
    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,                     // 🔥 NECESARIO PARA GYM_MANAGER Y CREAR COACHES
          email: user.email,
          nombre: user.nombre,
          role: user.tipoUsuario,          // 🔥 YA DEVUELVE COACH_INTERNO, GYM_MANAGER TAL CUAL
          isAdmin: user.isAdmin,
          gymManagerId: user.gymManagerId, // 🔥 SI ES COACH_INTERNO, ESTO INDICA SU PADRE
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