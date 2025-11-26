import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const dataToUpdate: any = { ...body };

  // Fix date fields (convert to Date object)
  if (body.startDate) dataToUpdate.startDate = new Date(body.startDate);
  if (body.endDate) dataToUpdate.endDate = new Date(body.endDate);
  if (body.registrationDeadline)
    dataToUpdate.registrationDeadline = new Date(body.registrationDeadline);

  // Convert number fields
  if (body.price) dataToUpdate.price = Number(body.price);
  if (body.maxPeople) dataToUpdate.maxPeople = Number(body.maxPeople);

  try {
    const updated = await prisma.picnic.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Updated!", updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
