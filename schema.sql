-- ===================================================
-- Database Schema: Field Report Management
-- Case Study: MAPID
-- ===================================================

-- Enable pgcrypto extension for UUID generation (if PostgreSQL < 13)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for retrieving reports ordered by created_at DESC
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);
