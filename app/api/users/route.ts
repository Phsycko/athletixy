import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Importar Prisma solo cuando se necesite - dentro de la función
async function getPrisma() {
  // Asegurar DATABASE_URL antes de importar
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
  }
  
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

    // Normalizar email
    const emailNormalized = email.trim().toLowerCase();

    // Verificar si el usuario ya existe
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

    // Crear usuario
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
      {
        message: "Usuario creado exitosamente",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creando usuario - Detalles completos:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Mensaje de error más específico
    let errorMessage = "Error al crear el usuario. Por favor intenta nuevamente.";
    
    if (error.code === 'P2002') {
      errorMessage = "Este email ya está registrado";
    } else if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      errorMessage = "Error de conexión con la base de datos. Verifica la configuración.";
    } else if (error.message?.includes('Tenant or user not found')) {
      errorMessage = "Error de autenticación con la base de datos. Verifica las credenciales.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
