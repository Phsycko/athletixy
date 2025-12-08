import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Normalizar email
    const emailNormalized = email.trim().toLowerCase();

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Si el tipo es 'gym', convertirlo a 'GYM_MANAGER' para el sistema
    const roleFinal = user.tipoUsuario === "gym" ? "GYM_MANAGER" : user.tipoUsuario;

    // Retornar datos del usuario (sin contraseña)
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
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}
