import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 FIXED

  try {
    const deleted = await prisma.picnic.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Picnic deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete picnic" },
      { status: 500 }
    );
  }
}
