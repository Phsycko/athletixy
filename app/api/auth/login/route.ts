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

    // 🔍 DEBUG — mira lo que llega desde el frontend
    console.log("📩 Email recibido:", email);
    console.log("🔑 Password recibido:", password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // 🔍 DEBUG
    console.log("📩 Email normalizado:", emailNormalized);

    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    // 🔍 DEBUG
    console.log("👤 Usuario encontrado en BD:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    // 🔍 DEBUG
    console.log("🔐 Password coincide?:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 🔥 ARREGLO DE ROLES
    // Normalizamos el tipoUsuario para que tu frontend no falle
    let roleFinal = user.tipoUsuario.toLowerCase();

    if (roleFinal === "gym_manager") {
      roleFinal = "gym";
    }

    console.log("🏷️ Role final enviado al frontend:", roleFinal);

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          tipoUsuario: roleFinal,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}