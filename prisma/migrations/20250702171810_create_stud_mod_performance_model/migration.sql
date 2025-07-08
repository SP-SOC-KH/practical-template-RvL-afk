-- CreateTable
CREATE TABLE "stud_mod_performance" (
    "adm_no" CHAR(4) NOT NULL,
    "mod_registered" VARCHAR(10) NOT NULL,
    "mark" INTEGER,
    "grade" CHAR(2),

    CONSTRAINT "stud_mod_performance_pkey" PRIMARY KEY ("adm_no","mod_registered")
);
