-- CreateTable
CREATE TABLE "Picnic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "upiId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Picnic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "picnicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "upiId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Picnic_adminId_idx" ON "Picnic"("adminId");

-- CreateIndex
CREATE INDEX "Registration_picnicId_idx" ON "Registration"("picnicId");

-- CreateIndex
CREATE INDEX "Registration_email_idx" ON "Registration"("email");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_picnicId_fkey" FOREIGN KEY ("picnicId") REFERENCES "Picnic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
