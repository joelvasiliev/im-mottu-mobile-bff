-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FavoritePairs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "character_id" INTEGER NOT NULL,
    "cat_id" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "FavoritePairs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
