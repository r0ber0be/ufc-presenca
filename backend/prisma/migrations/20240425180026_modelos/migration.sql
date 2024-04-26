-- CreateTable
CREATE TABLE "Turma" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "numberOfStudents" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "extraHour" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "acceptPresenceByQRCode" TEXT NOT NULL,
    "block" TEXT,
    "classroom" TEXT,
    "professorID" TEXT NOT NULL,
    CONSTRAINT "Turma_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professor" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Presenca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alunoID" TEXT NOT NULL,
    "turmaID" TEXT NOT NULL,
    CONSTRAINT "Presenca_alunoID_fkey" FOREIGN KEY ("alunoID") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Presenca_turmaID_fkey" FOREIGN KEY ("turmaID") REFERENCES "Turma" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PresencaDia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "isPresent" BOOLEAN NOT NULL,
    "presencaID" TEXT NOT NULL,
    CONSTRAINT "PresencaDia_presencaID_fkey" FOREIGN KEY ("presencaID") REFERENCES "Presenca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TurmaAluno" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TurmaAluno_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluno" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TurmaAluno_B_fkey" FOREIGN KEY ("B") REFERENCES "Turma" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Turma_id_key" ON "Turma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_code_key" ON "Turma"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_id_key" ON "Aluno"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_alunoID_key" ON "Presenca"("alunoID");

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_turmaID_key" ON "Presenca"("turmaID");

-- CreateIndex
CREATE UNIQUE INDEX "_TurmaAluno_AB_unique" ON "_TurmaAluno"("A", "B");

-- CreateIndex
CREATE INDEX "_TurmaAluno_B_index" ON "_TurmaAluno"("B");
