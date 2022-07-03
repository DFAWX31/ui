-- CreateTable
CREATE TABLE "Members" (
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "numberOfWarns" INTEGER NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("guildId","userId")
);

-- CreateTable
CREATE TABLE "Warns" (
    "id" SERIAL NOT NULL,
    "member" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warns" ADD CONSTRAINT "Warns_member_guildId_fkey" FOREIGN KEY ("member", "guildId") REFERENCES "Members"("userId", "guildId") ON DELETE RESTRICT ON UPDATE CASCADE;
