-- =====================================================================
-- Tennis String Advisor — Schéma d'authentification (NextAuth) pour Supabase
-- =====================================================================
-- À exécuter dans Supabase : menu « SQL Editor » → New query → coller → Run.
-- Version IDEMPOTENTE : utilise IF NOT EXISTS, donc ré-exécutable sans danger
-- même si certaines tables existent déjà.
--
-- Les tables sont créées dans le schéma "public" (par défaut) ; elles ne
-- touchent PAS au schéma "auth" interne de Supabase (aucun conflit).
--
-- Tables créées : User, Account, Session, VerificationToken, Configuration
-- (générées depuis prisma/schema.prisma — alternative à `npx prisma db push`)
-- =====================================================================

-- ---------- Table User ----------
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- ---------- Table Account (comptes OAuth liés : Google, etc.) ----------
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- ---------- Table Session (sessions persistées en base) ----------
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- ---------- Table VerificationToken (liens magiques e-mail) ----------
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- ---------- Table Configuration (configurations sauvegardées) ----------
CREATE TABLE IF NOT EXISTS "Configuration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "racquetId" TEXT NOT NULL,
    "mainStringId" TEXT NOT NULL,
    "crossStringId" TEXT,
    "mainGauge" TEXT NOT NULL,
    "crossGauge" TEXT NOT NULL,
    "mainTension" DOUBLE PRECISION NOT NULL,
    "crossTension" DOUBLE PRECISION NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "rcsScore" DOUBLE PRECISION NOT NULL,
    "compatibility" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- ---------- Index uniques ----------
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- ---------- Clés étrangères (ON DELETE CASCADE) ----------
-- Postgres ne supporte pas "ADD CONSTRAINT IF NOT EXISTS" : on protège chaque
-- ajout dans un bloc DO qui ignore l'erreur si la contrainte existe déjà.

DO $$ BEGIN
  ALTER TABLE "Account"
    ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Session"
    ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Configuration"
    ADD CONSTRAINT "Configuration_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
