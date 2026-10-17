-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('Python', 'Cplusplus', 'JS', 'GO', 'RUST');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "output" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
