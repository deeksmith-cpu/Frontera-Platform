---
name: db-migration
description: Create Supabase database migrations. Use when user says "add table", "create migration", "update schema", "add column", "database change", or asks to modify the database.
---

# Database Migration Skill

Creates and manages Supabase PostgreSQL migrations for the Frontera Platform.

## When to Use

Activate when user requests:
- "add table"
- "create migration"
- "update schema"
- "add column"
- "database change"

## Existing Schema Reference

Key tables (from CLAUDE.md):

| Table | Purpose |
|-------|---------|
| `clients` | Organization profiles (linked to Clerk org) |
| `client_onboarding` | Onboarding applications |
| `conversations` | Strategy Coach chat sessions |
| `conversation_messages` | Individual chat messages |
| `strategic_outputs` | Generated strategy documents |

## Migration Process

### 1. Create Migration File

Location: `supabase/migrations/`

Naming: `{timestamp}_{description}.sql`

Example: `20260102150000_add_documents_table.sql`

### 2. Standard Table Pattern

```sql
-- Create table with standard columns
CREATE TABLE IF NOT EXISTS public.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT NOT NULL,

  -- Feature-specific columns
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',

  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on org_id for multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_{table_name}_clerk_org_id
  ON public.{table_name}(clerk_org_id);

-- Enable RLS
ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their org's data
CREATE POLICY "{table_name}_org_isolation" ON public.{table_name}
  FOR ALL
  USING (clerk_org_id = current_setting('app.current_org_id', true));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_{table_name}_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER {table_name}_updated_at
  BEFORE UPDATE ON public.{table_name}
  FOR EACH ROW
  EXECUTE FUNCTION update_{table_name}_updated_at();
```

### 3. Add Column Pattern

```sql
-- Add new column
ALTER TABLE public.{table_name}
  ADD COLUMN IF NOT EXISTS {column_name} {TYPE} {CONSTRAINTS};

-- Add index if needed for queries
CREATE INDEX IF NOT EXISTS idx_{table_name}_{column_name}
  ON public.{table_name}({column_name});
```

### 4. Foreign Key Pattern

```sql
-- Add foreign key to existing table
ALTER TABLE public.{child_table}
  ADD COLUMN IF NOT EXISTS {parent}_id UUID REFERENCES public.{parent_table}(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_{child_table}_{parent}_id
  ON public.{child_table}({parent}_id);
```

### 5. JSONB Column Pattern

For flexible/evolving data:

```sql
-- Add JSONB column with default
ALTER TABLE public.{table_name}
  ADD COLUMN IF NOT EXISTS {column_name} JSONB DEFAULT '{}';

-- Add GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_{table_name}_{column_name}_gin
  ON public.{table_name} USING GIN ({column_name});
```

## Update TypeScript Types

After creating migration, update `src/types/database.ts`:

```typescript
export interface {TableName} {
  id: string;
  clerk_org_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Add to Database interface
export interface Database {
  public: {
    Tables: {
      // ... existing tables
      {table_name}: {
        Row: {TableName};
        Insert: Omit<{TableName}, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<{TableName}, 'id'>>;
      };
    };
  };
}
```

## Common Patterns

### Status Enum
```sql
CREATE TYPE {feature}_status AS ENUM ('draft', 'active', 'completed', 'archived');
```

### Soft Delete
```sql
ALTER TABLE public.{table_name}
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_{table_name}_deleted_at
  ON public.{table_name}(deleted_at)
  WHERE deleted_at IS NULL;
```

### Conversation Reference
```sql
-- Link to conversations table
ALTER TABLE public.{table_name}
  ADD COLUMN IF NOT EXISTS conversation_id UUID
  REFERENCES public.conversations(id) ON DELETE CASCADE;
```

## Apply Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply directly
psql $DATABASE_URL -f supabase/migrations/{migration_file}.sql
```
