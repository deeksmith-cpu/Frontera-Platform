---
name: api-route
description: Create API routes following Frontera patterns. Use when user says "create api", "add endpoint", "new route", "api for", or asks to build an API endpoint.
---

# API Route Creator Skill

Creates Next.js App Router API routes following Frontera patterns.

## When to Use

Activate when user requests:
- "create api"
- "add endpoint"
- "new route"
- "api for"
- Building an API endpoint

## Location

All API routes go in `src/app/api/`

## Standard Patterns

### Basic CRUD Route

```typescript
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

// GET - List or retrieve
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('clerk_org_id', orgId);

    if (error) {
      console.error('Failed to fetch:', error);
      return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('table_name')
      .insert({ ...body, clerk_org_id: orgId })
      .select()
      .single();

    if (error) {
      console.error('Failed to create:', error);
      return Response.json({ error: 'Failed to create' }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Dynamic Route with ID

Location: `src/app/api/feature/[id]/route.ts`

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single item
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  // ... fetch by id
}

// PATCH - Update
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  // ... update by id
}

// DELETE
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  // ... delete by id
}
```

### Streaming AI Response

For AI/LLM endpoints:

```typescript
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { message } = await req.json();

  const anthropic = new Anthropic();
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: message }],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

## Error Response Format

Always return errors as:
```typescript
return Response.json({ error: 'Error message' }, { status: statusCode });
```

## Analytics Integration

Add PostHog tracking for key endpoints:
```typescript
import { trackFeatureEvent } from '@/lib/analytics/feature';

// In handler after successful operation:
trackFeatureEvent({ user_id: userId, org_id: orgId, ... });
```

## Validation

For complex inputs, validate with types:
```typescript
interface CreateFeatureBody {
  name: string;
  description?: string;
}

const body: CreateFeatureBody = await req.json();
if (!body.name) {
  return Response.json({ error: 'Name is required' }, { status: 400 });
}
```
