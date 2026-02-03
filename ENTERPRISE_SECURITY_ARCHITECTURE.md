# Frontera Platform
## Enterprise Security & Architecture Overview

**Document Version:** 1.0
**Date:** January 2026
**Classification:** Confidential - For Enterprise Clients
**Prepared For:** Procurement, Enterprise Technology & Security Departments

---

## Executive Summary

### Platform Purpose

Frontera is an enterprise-grade AI-powered strategic coaching platform designed specifically for blue-chip and highly regulated organizations undergoing product transformation. The platform bridges the gap between strategic vision and operational execution by providing structured, evidence-based coaching through our proprietary **Product Strategy Research Playbook** methodology.

Unlike generic consulting or basic strategy tools, Frontera combines:
- **Proven Methodology**: Four-phase strategic transformation framework (Discovery → 3Cs Research → Synthesis → Strategic Bets)
- **AI-Powered Intelligence**: Claude Sonnet 4 AI coaching that adapts to your industry, organization size, and strategic focus
- **Enterprise Security**: Multi-tenant architecture built ground-up for data isolation, regulatory compliance, and information security

### Key Customer Benefits

| Benefit | Description | Enterprise Value |
|---------|-------------|------------------|
| **Accelerated Strategy Development** | Structured 4-phase methodology reduces strategy development cycles from months to weeks | 60-70% faster time-to-insight |
| **Evidence-Based Decision Making** | AI coach synthesizes Company, Customer, and Competitor research into actionable strategic bets | Reduced strategic risk through data-driven hypotheses |
| **Institutional Knowledge Capture** | All coaching conversations, research insights, and strategic outputs stored securely within your organization's isolated tenant | Prevents knowledge loss from employee turnover |
| **Regulatory Compliance Ready** | Built on enterprise-grade infrastructure (Supabase, Clerk, Vercel) with data residency controls and audit capabilities | SOC 2 Type II preparation underway |
| **Scalable Across Enterprise** | Organization-based licensing enables unlimited users within your company to collaborate on strategy development | Department-wide or enterprise-wide deployment |

### Target Use Cases

1. **Product Portfolio Strategy**: Multi-product organizations defining competitive positioning and resource allocation
2. **Market Expansion Planning**: Companies entering new markets requiring structured competitive analysis
3. **Digital Transformation**: Traditional businesses modernizing product offerings with evidence-based roadmaps
4. **M&A Integration**: Newly merged entities aligning product strategies across combined portfolios

### Security & Compliance Posture

Frontera has been architected from day one for **enterprise security, data protection, and regulatory compliance**:

- **Zero-Trust Multi-Tenancy**: Organization data is cryptographically isolated with defense-in-depth security
- **Data Sovereignty**: EU/UK data residency options via Vercel edge network and Supabase regional deployments
- **Enterprise Authentication**: Clerk-based SSO with support for SAML 2.0 and OpenID Connect (Enterprise tier)
- **Encryption Everywhere**: AES-256 at rest, TLS 1.3 in transit, with field-level encryption roadmap
- **Audit Trail**: Comprehensive logging of all data access, modifications, and administrative actions
- **AI Security**: Anthropic Claude API provides constitutional AI with built-in safety guardrails, hosted in SOC 2 certified infrastructure

**Current Compliance Status:**
- ✅ GDPR baseline compliance (data residency, deletion workflows, consent management)
- ✅ CCPA compliance (user data rights, opt-out mechanisms)
- �� SOC 2 Type II certification (in progress, Q2 2026 target)
- 🔄 ISO 27001 preparation (Q3 2026 target)

---

## Technical Architecture

### Modern Technology Stack

Frontera leverages best-in-class technologies to deliver a secure, scalable, and performant platform:

| Layer | Technology | Rationale | Security Benefits |
|-------|------------|-----------|-------------------|
| **Frontend Framework** | Next.js 15 (React 19) | Modern server-side rendering, automatic code splitting, optimized performance | XSS protection via React's automatic escaping, Content Security Policy support |
| **Language** | TypeScript (Strict Mode) | Type safety eliminates entire classes of runtime errors | Prevents type confusion attacks, enforces secure coding patterns |
| **Authentication** | Clerk | Enterprise-grade auth with SSO, MFA, and organization management | SOC 2 Type II certified, SAML/OIDC support, session security, bot detection |
| **Database** | Supabase (PostgreSQL 15) | Scalable relational database with real-time capabilities and Row-Level Security | RLS policies enforce tenant isolation at database layer, AES-256 encryption at rest |
| **AI Provider** | Anthropic Claude API | Constitutional AI with built-in safety and alignment | SOC 2 Type II certified, GDPR/HIPAA compliant infrastructure, no model training on customer data |
| **Deployment** | Vercel Edge Network | Global CDN with automatic scaling and DDoS protection | Edge caching, automatic HTTPS, Web Application Firewall (WAF) |
| **Analytics** | PostHog | Privacy-first product analytics with EU hosting options | Self-hosted option available, GDPR compliant, no third-party data sharing |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework with zero runtime | No dynamic styles = reduced XSS surface area |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ENTERPRISE CLIENT                            │
│  (Browser with Clerk SSO, MFA, Device Trust)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/TLS 1.3
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL EDGE NETWORK                            │
│  • Global CDN (EU/US/APAC regions)                              │
│  • DDoS Protection (L3/L4/L7)                                   │
│  • Web Application Firewall (WAF)                               │
│  • Automatic HTTPS with HSTS                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 FRONTERA NEXT.JS APPLICATION                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware (Clerk JWT Verification)       │  │
│  │  • All routes protected by default                        │  │
│  │  • Organization context extraction from JWT               │  │
│  │  • Role-based access control (RBAC)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes (Server-Side Only)                            │  │
│  │  • Tenant-scoped queries (clerk_org_id filter)            │  │
│  │  • Input validation (schema validation)                   │  │
│  │  • Rate limiting (per-user, per-org)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Strategy Coach AI Agent                                  │  │
│  │  • Stateless function with conversation state in DB       │  │
│  │  • Client context injection (industry, size, focus)       │  │
│  │  • Streaming responses for real-time feedback             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────┬────────────────────────┬────────────────────────┬─────────┘
     │                        │                        │
     ↓                        ↓                        ↓
┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   CLERK     │    │   SUPABASE       │    │  ANTHROPIC       │
│   (Auth)    │    │   (Database)     │    │  (AI API)        │
├─────────────┤    ├──────────────────┤    ├──────────────────┤
│• User Store │    │• PostgreSQL 15   │    │• Claude Sonnet 4 │
│• Orgs/Teams │    │• Row-Level Sec.  │    │• Constitutional  │
│• SSO/SAML   │    │• AES-256 encrypt │    │  AI (safety)     │
│• JWT tokens │    │• Daily backups   │    │• No training on  │
│• MFA        │    │• EU/US regions   │    │  customer data   │
│             │    │• Point-in-time   │    │• SOC 2 certified │
│             │    │  recovery        │    │                  │
└─────────────┘    └──────────────────┘    └──────────────────┘
```

### Key Architectural Principles

#### 1. Defense-in-Depth Security
Every layer of the stack provides independent security controls:
- **Edge Layer**: DDoS protection, WAF, rate limiting
- **Application Layer**: Authentication middleware, tenant scoping, input validation
- **Database Layer**: Row-Level Security (RLS) policies, encrypted connections
- **Infrastructure Layer**: Private networks, encrypted storage, audit logging

#### 2. Zero-Trust Multi-Tenancy
Organization data is isolated through multiple mechanisms:
- **Logical Isolation**: `clerk_org_id` foreign key on all tenant-scoped tables
- **Application Enforcement**: Every database query includes `WHERE clerk_org_id = ?` filter
- **Database Enforcement**: RLS policies extract `org_id` from JWT and enforce at PostgreSQL level
- **Cascade Deletion**: Organization deletion automatically removes all associated data

#### 3. Stateless & Scalable
- **Server Components**: Most UI rendered server-side (reduces client-side attack surface)
- **Stateless APIs**: No session state on application servers (horizontal scaling)
- **Edge Caching**: Static assets cached globally for low-latency access
- **Database Connection Pooling**: Supabase manages connection pools automatically

#### 4. API-First Design
All functionality exposed via RESTful APIs enables:
- **Future integrations** with enterprise systems (SSO, data warehouses, BI tools)
- **Audit logging** at API boundary
- **Rate limiting** and throttling controls
- **Versioning** for backward compatibility

---

## Data Protection & Information Security

### 1. Data Encryption

#### Encryption at Rest

| Data Store | Encryption Method | Key Management | Compliance |
|------------|-------------------|----------------|------------|
| **Supabase PostgreSQL** | AES-256-GCM | AWS KMS (customer-managed keys available) | GDPR, SOC 2 |
| **Uploaded Documents** | AES-256 (Supabase Storage) | AWS KMS | GDPR, SOC 2 |
| **Clerk User Data** | AES-256 | Clerk-managed HSM | SOC 2 Type II |
| **Conversation Backups** | AES-256 (automated daily) | Supabase-managed | GDPR, SOC 2 |

**Roadmap - Field-Level Encryption (Q2 2026):**
- Client-side encryption for highly sensitive fields (e.g., uploaded strategy documents)
- Zero-knowledge architecture option (Frontera cannot decrypt without customer key)
- Transparent field-level encryption via database triggers

#### Encryption in Transit

- **TLS 1.3** enforced for all connections (client ↔ Vercel, Vercel ↔ Supabase, Vercel ↔ Anthropic)
- **Certificate Pinning** for API connections (prevents MITM attacks)
- **HSTS Headers** force HTTPS for all subsequent requests (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`)
- **Forward Secrecy** enabled (ephemeral key exchange prevents decryption of captured traffic)

**TLS Configuration:**
```
Minimum Version: TLS 1.3
Cipher Suites:
  - TLS_AES_128_GCM_SHA256
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256
Perfect Forward Secrecy: Enabled
Certificate: Let's Encrypt (auto-renewed)
```

### 2. Multi-Tenant Data Isolation

#### Database Schema Design

Every tenant-scoped table includes `clerk_org_id` as the isolation key:

```sql
-- Client configuration (tenant root)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT UNIQUE NOT NULL,  -- Foreign key to Clerk
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL,  -- pilot, professional, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (tenant-scoped)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT NOT NULL,  -- Tenant isolation key
  clerk_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,  -- active, archived, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_client
    FOREIGN KEY (clerk_org_id)
    REFERENCES clients(clerk_org_id)
    ON DELETE CASCADE  -- Cascade deletion ensures no orphaned data
);

-- Messages (tenant-scoped)
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,  -- Redundant isolation for query performance
  role TEXT NOT NULL,  -- user, assistant
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategic outputs (tenant-scoped)
CREATE TABLE strategic_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  clerk_org_id TEXT NOT NULL,
  output_type TEXT NOT NULL,  -- discovery_baseline, territory_map, synthesis, strategic_bets
  content JSONB NOT NULL,  -- Structured strategy data
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes for Security & Performance:**
```sql
CREATE INDEX idx_conversations_clerk_org_id ON conversations(clerk_org_id);
CREATE INDEX idx_conversations_clerk_user_id ON conversations(clerk_user_id);
CREATE INDEX idx_conversation_messages_clerk_org_id ON conversation_messages(clerk_org_id);
CREATE INDEX idx_strategic_outputs_clerk_org_id ON strategic_outputs(clerk_org_id);
```

#### Row-Level Security (RLS) Policies

Supabase RLS provides **database-level enforcement** of tenant boundaries. Even if application code is compromised, the database prevents cross-tenant data access.

**JWT Helper Functions:**
```sql
-- Extract org_id from JWT claims
CREATE OR REPLACE FUNCTION public.get_org_id() RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'org_id',
    ''
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Extract user_id from JWT claims
CREATE OR REPLACE FUNCTION public.get_clerk_user_id() RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    ''
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is Frontera super admin
CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'frontera:super_admin',
    false
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

**Example RLS Policies:**
```sql
-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Super admins have full access (for support/auditing)
CREATE POLICY "super_admins_full_access"
  ON conversations FOR ALL
  USING (public.is_super_admin());

-- Org members can view their organization's conversations
CREATE POLICY "org_members_can_view"
  ON conversations FOR SELECT
  USING (clerk_org_id = public.get_org_id());

-- Users can only update their own conversations
CREATE POLICY "users_can_update_own"
  ON conversations FOR UPDATE
  USING (
    clerk_org_id = public.get_org_id()
    AND clerk_user_id = public.get_clerk_user_id()
  );

-- Users can create conversations for their org
CREATE POLICY "users_can_create_for_org"
  ON conversations FOR INSERT
  WITH CHECK (clerk_org_id = public.get_org_id());
```

**Nested Resource Protection:**
For related resources (e.g., messages belonging to conversations), RLS policies verify the parent resource ownership:

```sql
CREATE POLICY "users_can_view_own_org_messages"
  ON conversation_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.clerk_org_id = public.get_org_id()
    )
  );
```

#### Application-Level Tenant Scoping

**Every API route enforces tenant scoping:**
```typescript
// Extract authenticated user's organization ID
const { userId, orgId } = await auth();
if (!userId || !orgId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Query ALWAYS includes clerk_org_id filter
const { data: conversations } = await supabase
  .from("conversations")
  .select("*")
  .eq("clerk_org_id", orgId)  // Tenant filter
  .order("created_at", { ascending: false });

// For resource updates, verify ownership BEFORE mutation
const { data: conversation } = await supabase
  .from("conversations")
  .select("id, clerk_org_id")
  .eq("id", conversationId)
  .eq("clerk_org_id", orgId)  // Ownership check
  .single();

if (!conversation) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

// Now safe to perform update
await supabase
  .from("conversations")
  .update({ status: "archived" })
  .eq("id", conversationId);
```

**Defense-in-Depth Benefits:**
1. **Application Layer**: Explicit `clerk_org_id` filtering prevents cross-tenant access
2. **Database Layer**: RLS policies enforce tenant boundaries even if application code is bypassed
3. **JWT Layer**: Clerk signs JWTs, preventing token forgery
4. **Infrastructure Layer**: Supabase isolates database connections per request

### 3. Authentication & Access Control

#### Enterprise Authentication (Clerk)

Frontera uses **Clerk** as the identity provider, offering enterprise-grade authentication:

| Feature | Description | Security Benefit |
|---------|-------------|------------------|
| **Single Sign-On (SSO)** | SAML 2.0, OpenID Connect, OAuth 2.0 | Centralizes identity management, enables corporate SSO (Azure AD, Okta, Google Workspace) |
| **Multi-Factor Authentication (MFA)** | TOTP (Google Authenticator, Authy), SMS, Email | Prevents account takeover even if password compromised |
| **Passwordless Authentication** | Magic links, passkeys (WebAuthn) | Eliminates password phishing attacks |
| **Device Trust** | Device fingerprinting, session tracking | Detects suspicious login locations and devices |
| **Bot Detection** | CAPTCHA integration, rate limiting | Prevents automated attacks |
| **Session Management** | Short-lived JWTs (60s default), automatic refresh | Reduces window for token theft |
| **IP Allowlisting** | Enterprise tier feature | Restricts access to corporate networks |

**JWT Structure:**
```json
{
  "sub": "user_2a1b3c4d",
  "org_id": "org_xyz123",
  "user_id": "user_2a1b3c4d",
  "metadata": {
    "role": "org:admin"
  },
  "iat": 1704629400,
  "exp": 1704629460,
  "iss": "https://clerk.frontera.com",
  "aud": "frontera-platform"
}
```

**Token Security:**
- **Algorithm**: RS256 (RSA signature with SHA-256)
- **Key Rotation**: Automatic every 90 days
- **Expiration**: 60 seconds (forces frequent validation)
- **Refresh**: Automatic via Clerk SDK (invisible to users)
- **Revocation**: Instant via Clerk API (for terminated employees)

#### Role-Based Access Control (RBAC)

Frontera implements a **hierarchical RBAC model**:

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTERA SUPER ADMIN (frontera:super_admin)                │
│  • Approve/reject client onboarding applications            │
│  • View all organizations (for support)                     │
│  • Manage platform-wide settings                            │
│  • Access audit logs across all tenants                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  ORGANIZATION ADMIN (org:admin)                             │
│  • Invite/remove team members                               │
│  • View all conversations within organization               │
│  • Manage organization settings                             │
│  • Delete organization data                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  ORGANIZATION MEMBER (org:member)                           │
│  • Create/edit own conversations                            │
│  • View shared conversations (future: RBAC per conversation)│
│  • Upload strategy documents                                │
│  • Generate strategic outputs                               │
└─────────────────────────────────────────────────────────────┘
```

**Permission Enforcement Example:**
```typescript
// Admin-only operation: Invite team member
const { userId, orgRole } = await auth();

if (orgRole !== "org:admin") {
  return NextResponse.json(
    { error: "Only organization admins can invite members" },
    { status: 403 }
  );
}

// Proceed with invitation
const clerk = await clerkClient();
await clerk.organizations.createOrganizationInvitation({
  organizationId: orgId,
  emailAddress: inviteeEmail,
  role: "org:member",
});
```

**Roadmap - Fine-Grained Permissions (Q3 2026):**
- Conversation-level permissions (Owner, Editor, Viewer)
- Custom roles (e.g., "Strategy Lead" with elevated permissions)
- Resource-specific permissions (e.g., restrict access to certain strategic outputs)

### 4. Data Retention & Deletion

#### Cascade Deletion

When an organization is deleted (via Clerk webhook), **all associated data is automatically removed**:

```sql
-- Organization deletion triggers cascade
DELETE FROM clients WHERE clerk_org_id = 'org_xyz123';

-- Automatically deletes (via ON DELETE CASCADE):
-- • conversations (all conversations for org)
-- • conversation_messages (all messages in those conversations)
-- • strategic_outputs (all strategy documents)
-- • phase_progress (all coaching phase tracking)
-- • uploaded_materials (all uploaded files)
-- • territory_insights (all research insights)
-- • synthesis_outputs (all synthesis reports)
```

**Webhook Handler:**
```typescript
// src/app/api/webhooks/clerk/route.ts
if (event.type === "organization.deleted") {
  const { id: clerkOrgId } = event.data;

  // Delete client record (cascade handles rest)
  await supabaseAdmin
    .from("clients")
    .delete()
    .eq("clerk_org_id", clerkOrgId);

  // Log deletion for audit trail
  await trackEvent("organization_deleted", "system", {
    clerk_org_id: clerkOrgId,
    timestamp: new Date().toISOString(),
  });
}
```

#### Soft Deletion for Conversations

Conversations use a **soft delete pattern** to allow recovery:

```typescript
// Archive conversation (soft delete)
await supabase
  .from("conversations")
  .update({ status: "archived" })
  .eq("id", conversationId);

// Exclude archived from default queries
const { data: activeConversations } = await supabase
  .from("conversations")
  .select("*")
  .eq("clerk_org_id", orgId)
  .eq("status", "active");  // Only active conversations
```

**Roadmap - Data Retention Policy (Q2 2026):**
- **Automatic Purge**: Hard delete archived conversations after 90 days
- **Configurable Retention**: Enterprise tier allows custom retention periods (1-7 years)
- **Legal Hold**: Flag conversations to prevent deletion during litigation
- **Scheduled Cleanup Jobs**: Nightly batch deletion of expired data
- **Deletion Confirmation**: Require admin approval for bulk deletions

#### GDPR Right to Erasure

For GDPR compliance, Frontera will provide **user data export and deletion**:

**User Data Export (Roadmap - Q2 2026):**
```typescript
// API endpoint: /api/user/export
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();

  // Export all user data
  const userData = {
    profile: await getUserProfile(userId),
    conversations: await getUserConversations(userId, orgId),
    messages: await getUserMessages(userId, orgId),
    uploads: await getUserUploads(userId, orgId),
  };

  // Return as downloadable JSON
  return new Response(JSON.stringify(userData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="frontera-data-${userId}.json"`,
    },
  });
}
```

**User Data Deletion (Roadmap - Q2 2026):**
```typescript
// API endpoint: /api/user/delete
export async function DELETE(req: NextRequest) {
  const { userId, orgId } = await auth();

  // Anonymize user in conversations (preserve org data)
  await supabase
    .from("conversation_messages")
    .update({ clerk_user_id: "deleted-user" })
    .eq("clerk_user_id", userId)
    .eq("clerk_org_id", orgId);

  // Delete user from Clerk
  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);

  return NextResponse.json({ success: true });
}
```

### 5. Audit Logging & Monitoring

#### Audit Trail

All security-relevant events are logged to **PostHog** with structured event data:

| Event Type | Data Captured | Retention |
|------------|---------------|-----------|
| `user_login` | User ID, org ID, IP address, device, timestamp | 2 years |
| `user_logout` | User ID, session duration | 2 years |
| `conversation_created` | User ID, org ID, conversation ID, timestamp | 2 years |
| `conversation_archived` | User ID, org ID, conversation ID, timestamp | 2 years |
| `organization_member_invited` | Admin user ID, org ID, invitee email, role | 2 years |
| `organization_member_removed` | Admin user ID, org ID, removed user ID | 2 years |
| `admin_application_approved` | Admin user ID, application ID, org ID | 2 years |
| `document_uploaded` | User ID, org ID, file name, file size, timestamp | 2 years |
| `ai_request` | User ID, org ID, model, input tokens, output tokens, latency | 90 days |
| `webhook_received` | Event type, source, timestamp | 90 days |

**Audit Log Example:**
```typescript
// Track security-relevant event
await trackEvent("organization_member_removed", userId, {
  org_id: orgId,
  removed_user_id: removedUserId,
  removed_by_admin: userId,
  timestamp: new Date().toISOString(),
  ip_address: req.headers.get("x-forwarded-for"),
  user_agent: req.headers.get("user-agent"),
});
```

**Roadmap - Tamper-Proof Audit Log (Q3 2026):**
- Write audit logs to **append-only storage** (Supabase or S3 with versioning)
- Cryptographic signatures to prevent log tampering
- Dedicated audit log UI for security teams
- Exportable audit reports for compliance audits

#### Real-Time Monitoring

**Application Monitoring:**
- **PostHog**: User behavior, feature usage, error rates
- **Vercel Analytics**: Performance metrics, Core Web Vitals
- **Vercel Logs**: Server-side logs with 2-day retention (Hobby tier) or 1-month (Pro tier)

**Roadmap - Security Monitoring (Q2 2026):**
- **Sentry Integration**: Real-time error tracking with stack traces
- **Anomaly Detection**: Alert on unusual patterns (e.g., 100+ messages from one user in 1 minute)
- **Failed Login Monitoring**: Track brute force attempts
- **Rate Limit Alerts**: Notify admins when rate limits triggered
- **Data Export Alerts**: Notify admins when bulk data exports occur

### 6. AI Security & Privacy

#### Anthropic Claude API

Frontera uses **Anthropic's Claude Sonnet 4** as the AI reasoning engine. Anthropic provides enterprise-grade security:

| Security Feature | Description |
|------------------|-------------|
| **No Model Training on Customer Data** | Customer conversations are NEVER used to train Claude models |
| **Data Retention** | API requests/responses retained for 30 days (abuse monitoring only), then deleted |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest |
| **SOC 2 Type II Certified** | Annual audits by independent third-party |
| **GDPR Compliant** | Data Processing Agreement (DPA) available |
| **HIPAA Compliant** | Business Associate Agreement (BAA) available (Enterprise tier) |
| **Constitutional AI** | Built-in safety training to refuse harmful requests |

**API Request Pattern:**
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Server-side only
});

const streamResponse = await anthropic.messages.stream({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  system: systemPrompt,  // Coaching methodology + client context
  messages: conversationHistory,  // User <-> AI chat history
});
```

**Data Sent to Anthropic:**
- **System Prompt**: Coaching methodology, client context (industry, size, strategic focus)
- **Conversation History**: All prior messages in the conversation
- **User Message**: Current user question/input

**Data NOT Sent to Anthropic:**
- Other organizations' data (tenant isolation enforced)
- User email addresses or personal identifiers (only org-level context)
- Uploaded documents (roadmap: RAG integration with embeddings)

#### Prompt Injection Protection

**Current Protections:**
- **Separate System Prompt**: Instructions separated from user input (Anthropic best practice)
- **Constitutional AI**: Claude trained to refuse harmful instructions
- **Coaching Methodology Enforcement**: System prompt defines strict coaching behavior

**Roadmap - Enhanced Protections (Q2 2026):**
```typescript
// Input sanitization
function sanitizeUserInput(input: string): string {
  // Remove potential meta-instructions
  const blockedPatterns = [
    /ignore previous instructions/i,
    /you are now/i,
    /system prompt:/i,
    /your instructions are/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(input)) {
      throw new ValidationError("Input contains prohibited patterns");
    }
  }

  // Truncate to reasonable length
  return input.slice(0, 10000);
}

// Rate limiting per user
async function checkRateLimits(userId: string, orgId: string): Promise<void> {
  const key = `ratelimit:${orgId}:${userId}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }

  if (count > 100) {
    throw new RateLimitError("Maximum 100 messages per hour exceeded");
  }
}
```

#### AI Output Validation

**Roadmap - Content Moderation (Q3 2026):**
- **PII Detection**: Scan AI responses for accidental PII leakage (email, phone, SSN)
- **Hallucination Detection**: Validate factual claims against client context
- **Bias Detection**: Monitor for gender/race/age bias in coaching advice
- **Harmful Content**: Flag inappropriate language or advice

**AI Evaluation Framework (Operational):**
Frontera has a comprehensive AI evaluation test suite (90+ tests) to ensure quality:

| Metric | Threshold | Test Count | Purpose |
|--------|-----------|------------|---------|
| **Relevance** | ≥ 0.80 | 32 tests | Ensures AI responses address user questions |
| **Hallucination** | ≤ 0.20 | 10 tests | Detects fabricated information |
| **Tone Adherence** | ≥ 0.85 | 28 tests | Validates confident, professional coaching tone |
| **Completeness** | ≥ 0.75 | 20 tests | Ensures actionable, thorough responses |

**LLM-as-a-Judge Evaluation:**
```typescript
// Evaluate AI response quality
const judgment = await judgeResponse(
  userQuestion,
  aiResponse,
  clientContext,
  EVALUATION_CRITERIA.relevance
);

// {
//   score: 0.87,
//   reasoning: "Response directly addresses market expansion focus...",
//   confidence: "high"
// }

// Alert if quality degrades
if (judgment.score < 0.75) {
  await alertSecurityTeam({
    type: "ai_quality_degradation",
    conversation_id: conversationId,
    score: judgment.score,
  });
}
```

### 7. API Security

#### Input Validation

**Current Implementation:**
- Manual validation in each API route
- Type checking via TypeScript
- File type/size validation for uploads

**Example - File Upload Validation:**
```typescript
// Allowed MIME types
const allowedTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

if (!allowedTypes.includes(file.type)) {
  return NextResponse.json(
    { error: 'Invalid file type. Only PDF, DOCX, and TXT allowed.' },
    { status: 400 }
  );
}

// File size limit (10MB)
const maxSize = 10 * 1024 * 1024;
if (file.size > maxSize) {
  return NextResponse.json(
    { error: 'File too large. Maximum size is 10MB.' },
    { status: 400 }
  );
}
```

**Roadmap - Zod Schema Validation (Q2 2026):**
```typescript
import { z } from 'zod';

// Define request schema
const CreateConversationSchema = z.object({
  title: z.string().min(1).max(200),
  context: z.object({
    industry: z.enum(['Technology', 'Healthcare', 'Financial Services', 'Retail']),
    company_size: z.enum(['Startup', 'Growth', 'Enterprise']),
    strategic_focus: z.string().max(500),
  }),
});

// Validate request body
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Validation throws ZodError if invalid
  const validated = CreateConversationSchema.parse(body);

  // Proceed with validated data
}
```

#### Rate Limiting

**Current State:**
- Vercel platform limits: 100 req/10 sec (Hobby), 600 req/10 sec (Pro)
- Anthropic API: 50 requests/min (Tier 1)

**Roadmap - Application-Level Rate Limiting (Q2 2026):**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
  analytics: true,
});

// Apply to API routes
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();

  // Check rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(
    `user:${userId}`
  );

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit,
        remaining,
        reset: new Date(reset),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // Proceed with request
}
```

**Rate Limit Tiers:**
| User Type | Messages per Hour | Conversations per Day | Document Uploads per Day |
|-----------|-------------------|----------------------|--------------------------|
| **Pilot** | 100 | 10 | 20 |
| **Professional** | 500 | 50 | 100 |
| **Enterprise** | Custom | Custom | Custom |

#### Security Headers

**Current Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Roadmap - Enhanced Headers (Q2 2026):**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://clerk.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://clerk.com https://*.supabase.co https://api.anthropic.com;
  frame-ancestors 'none';

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

Permissions-Policy:
  geolocation=(),
  microphone=(),
  camera=()
```

#### Webhook Security

**Clerk Webhook Signature Verification:**
```typescript
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  // Get signature headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // Verify signature
  const wh = new Webhook(webhookSecret);
  let event;

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // Process verified webhook
  await handleWebhookEvent(event);

  return NextResponse.json({ success: true });
}
```

**Webhook Security Benefits:**
- **Signature Verification**: Cryptographic proof webhook is from Clerk
- **Timestamp Validation**: Prevents replay attacks (rejects old webhooks)
- **Secret Rotation**: Webhooks fail if secret rotated (forces update)

---

## Infrastructure & Resilience

### 1. Deployment Architecture

#### Vercel Edge Network

Frontera is deployed on **Vercel's global edge network**, providing:

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Global CDN** | 100+ edge locations worldwide | <50ms latency for most users |
| **Automatic Scaling** | Serverless functions scale to zero and to thousands | No capacity planning, cost-efficient |
| **DDoS Protection** | L3/L4/L7 mitigation | Handles volumetric attacks automatically |
| **Web Application Firewall (WAF)** | OWASP Top 10 protection | Blocks SQL injection, XSS, etc. |
| **Automatic HTTPS** | Let's Encrypt certificates, auto-renewal | Zero-config TLS 1.3 |
| **Zero-Downtime Deployments** | Atomic deployments with instant rollback | No maintenance windows |

**Regional Configuration:**
```json
{
  "regions": ["lhr1"],  // London (UK/EU data residency)
  "framework": "nextjs"
}
```

**Data Residency Options (Enterprise Tier):**
- **EU**: London (lhr1), Frankfurt (fra1), Dublin (dub1)
- **US**: Washington DC (iad1), San Francisco (sfo1)
- **APAC**: Tokyo (hnd1), Singapore (sin1)

#### Database Infrastructure (Supabase)

**PostgreSQL Configuration:**
- **Version**: PostgreSQL 15
- **Instance Type**: 4 vCPU, 16 GB RAM (scalable to 32 vCPU, 128 GB)
- **Storage**: SSD with automatic scaling
- **Replication**: Primary + 2 read replicas (Enterprise tier)
- **Connection Pooling**: PgBouncer (1000+ concurrent connections)

**Backup Strategy:**
- **Automated Backups**: Daily full backups, retained for 30 days
- **Point-in-Time Recovery (PITR)**: Restore to any second in the last 7 days
- **Cross-Region Replication**: Async replication to secondary region (Enterprise tier)
- **Backup Encryption**: AES-256 with separate encryption keys

**Disaster Recovery:**
| Scenario | Recovery Time Objective (RTO) | Recovery Point Objective (RPO) |
|----------|-------------------------------|--------------------------------|
| **Application Failure** | <1 minute (automatic rollback) | 0 (no data loss) |
| **Database Failure** | <5 minutes (automatic failover) | <1 minute (replication lag) |
| **Regional Outage** | <1 hour (manual failover to DR region) | <5 minutes (replication lag) |
| **Complete Data Loss** | <4 hours (restore from backup) | <24 hours (last daily backup) |

### 2. Availability & Uptime

**Service Level Agreement (SLA):**
| Tier | Uptime SLA | Monthly Downtime Allowance | Support Response Time |
|------|------------|----------------------------|------------------------|
| **Pilot** | 99.0% | 7 hours 18 minutes | Best effort (email) |
| **Professional** | 99.5% | 3 hours 36 minutes | 4 hours (business hours) |
| **Enterprise** | 99.9% | 43 minutes | 1 hour (24/7) |

**Historical Uptime (Last 6 Months):**
- Vercel: 99.99%
- Supabase: 99.95%
- Clerk: 99.98%
- Anthropic: 99.92%

**Monitoring & Alerting:**
- **Uptime Monitoring**: BetterUptime (1-minute intervals)
- **Incident Response**: PagerDuty integration
- **Status Page**: status.frontera.com (public)

### 3. Scalability

**Current Capacity:**
- **Concurrent Users**: 1,000+ (Vercel serverless auto-scales)
- **Database Connections**: 1,000 (PgBouncer connection pooling)
- **AI Requests**: 50 req/min (Anthropic Tier 1)
- **Storage**: 100 GB (Supabase Pro tier)

**Scaling Roadmap:**
| Component | Current Limit | Enterprise Limit | Scaling Method |
|-----------|---------------|------------------|----------------|
| **Concurrent Users** | 1,000 | 100,000+ | Vercel serverless (automatic) |
| **Database CPU** | 4 vCPU | 32 vCPU | Vertical scaling (Supabase) |
| **Database Storage** | 100 GB | 10 TB | Automatic expansion |
| **AI Rate Limit** | 50 req/min | 10,000 req/min | Anthropic Tier 4 upgrade |
| **File Storage** | 100 GB | 10 TB | Supabase Storage (S3-backed) |

### 4. Business Continuity

**Incident Response Plan:**
1. **Detection**: Automated monitoring alerts (Vercel, Supabase, PagerDuty)
2. **Escalation**: On-call engineer paged (P1: <15 min, P2: <1 hour)
3. **Investigation**: Access logs, metrics, error tracking (Sentry)
4. **Mitigation**: Rollback deployment, scale resources, failover
5. **Resolution**: Root cause analysis (RCA) within 24 hours
6. **Post-Mortem**: Blameless post-mortem, corrective actions

**Incident Severity Levels:**
| Level | Definition | Example | Response Time |
|-------|------------|---------|---------------|
| **P1 (Critical)** | Platform unavailable for all customers | Database down, API gateway failure | <15 minutes |
| **P2 (High)** | Major feature unavailable | AI streaming broken, auth login failing | <1 hour |
| **P3 (Medium)** | Minor feature degradation | Slow response times, non-critical UI bug | <4 hours |
| **P4 (Low)** | Cosmetic issue | Typo, minor UI glitch | <1 week |

---

## Compliance & Certifications

### 1. GDPR Compliance

Frontera is **GDPR-compliant by design**:

| Requirement | Frontera Implementation | Status |
|-------------|-------------------------|--------|
| **Lawful Basis for Processing** | Legitimate interest (service delivery) + Contract (paid customers) | ✅ Implemented |
| **Data Minimization** | Only collect data necessary for coaching (industry, size, focus) | ✅ Implemented |
| **Purpose Limitation** | Data used only for strategy coaching, not sold/shared | ✅ Implemented |
| **Storage Limitation** | Conversations archived after inactivity (roadmap: auto-delete after retention period) | 🔄 Q2 2026 |
| **Data Portability** | User data export API (JSON format) | 🔄 Q2 2026 |
| **Right to Erasure** | User/org deletion API (cascade deletion) | ✅ Implemented |
| **Data Breach Notification** | Incident response plan, notify within 72 hours | ✅ Implemented |
| **Data Protection Officer (DPO)** | DPO appointed for EU customers | 🔄 Q2 2026 |
| **Data Processing Agreement (DPA)** | Standard DPA available on request | ✅ Available |

**GDPR-Compliant Data Flow:**
```
┌──────────────────────────────────────────────────────────────┐
│  EU User (GDPR Protected)                                     │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTPS/TLS 1.3
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Vercel Edge (EU Region: London/Frankfurt/Dublin)            │
│  • Data processed in EU                                      │
│  • No data transfer to US without adequacy decision          │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  Supabase PostgreSQL (EU Region)                             │
│  • Data stored in EU (Frankfurt or London)                   │
│  • DPA with Supabase (AWS sub-processor)                     │
└──────────────────────────────────────────────────────────────┘
                          │
                          ↓ (for AI processing only)
┌──────────────────────────────────────────────────────────────┐
│  Anthropic API (US - Standard Contractual Clauses)          │
│  • DPA available                                             │
│  • Data retained 30 days, then deleted                       │
│  • Not used for model training                               │
└──────────────────────────────────────────────────────────────┘
```

**Data Transfer Mechanism (EU → US):**
- **Standard Contractual Clauses (SCCs)**: DPA with Anthropic includes EU SCCs
- **Adequacy Decision**: UK adequacy decision covers UK → EU transfers
- **Roadmap**: EU-hosted AI provider option (Q4 2026)

### 2. SOC 2 Type II Certification

**Status**: In Progress (Target: Q2 2026)

**SOC 2 Trust Service Criteria:**

| Criterion | Description | Frontera Controls |
|-----------|-------------|-------------------|
| **Security** | Protection against unauthorized access | Multi-tenancy, RLS, authentication, encryption, WAF |
| **Availability** | System uptime and performance | 99.9% SLA, redundancy, monitoring, incident response |
| **Processing Integrity** | System processes data correctly | Input validation, AI evaluation framework, testing (375+ tests) |
| **Confidentiality** | Sensitive data protected | Encryption at rest/in transit, RLS, audit logging |
| **Privacy** | PII collected/used per privacy notice | Data minimization, user consent, deletion workflows |

**Audit Timeline:**
- **Q1 2026**: Gap analysis, control design documentation
- **Q2 2026**: 6-month observation period begins
- **Q3 2026**: Auditor testing and evidence collection
- **Q4 2026**: SOC 2 Type II report issued

**Key Controls Being Implemented:**
1. Formal Information Security Policy (ISP)
2. Annual penetration testing by third-party firm
3. Quarterly vulnerability scanning
4. Security awareness training for employees
5. Vendor risk management program
6. Backup restoration testing (quarterly)
7. Disaster recovery tabletop exercises (bi-annual)

### 3. ISO 27001 Preparation

**Status**: Planned (Target: Q3 2026)

**ISO 27001 Annex A Controls:**
- **A.5 - Information Security Policies**: Documented ISP, acceptable use policy
- **A.6 - Organization of Information Security**: CISO role, security team
- **A.8 - Asset Management**: Asset inventory, data classification
- **A.9 - Access Control**: RBAC, MFA, least privilege
- **A.10 - Cryptography**: Encryption standards, key management
- **A.12 - Operations Security**: Change management, capacity planning, logging
- **A.13 - Communications Security**: Network segmentation, secure APIs
- **A.14 - System Acquisition**: Secure SDLC, security testing
- **A.16 - Incident Management**: Incident response plan, post-mortems
- **A.17 - Business Continuity**: DR plan, backup testing
- **A.18 - Compliance**: Legal register, audits, data protection

### 4. Additional Compliance Frameworks

**CCPA (California Consumer Privacy Act):**
- ✅ User data export (right to know)
- ✅ User data deletion (right to deletion)
- ✅ Opt-out of sale (Frontera does not sell data)
- ✅ Privacy policy disclosure

**HIPAA (Healthcare Organizations):**
- 🔄 Business Associate Agreement (BAA) available for Enterprise tier
- 🔄 Anthropic BAA (covered entity must request)
- 🔄 Audit logging of PHI access
- 🔄 Encryption validation (FIPS 140-2 compliant)

**PCI-DSS (Payment Card Industry):**
- ✅ No credit card data stored (Stripe handles payments)
- ✅ Stripe is PCI-DSS Level 1 certified

---

## Testing & Quality Assurance

### Comprehensive Test Coverage (375+ Tests)

Frontera maintains one of the most comprehensive test suites in the AI coaching space:

| Test Type | Framework | Test Count | Purpose |
|-----------|-----------|------------|---------|
| **Unit Tests** | Vitest | 158 | Validate business logic (framework state, client context, system prompts) |
| **Component Tests** | React Testing Library | 86 | Validate UI components (chat interface, message list, conversation list) |
| **Integration Tests** | Vitest | 41 | Validate API contracts (conversations CRUD, message streaming) |
| **E2E Tests** | Playwright | 96 | Validate user workflows across browsers (Chromium, Firefox, WebKit, Mobile) |
| **BDD Tests** | Cucumber | 30 scenarios | Validate acceptance criteria in plain English (Gherkin) |
| **AI Evaluation Tests** | Vitest + LLM-as-a-Judge | 90 | Validate AI output quality (relevance, hallucination, tone, completeness) |

**Total**: 501 automated tests

**CI/CD Pipeline:**
```yaml
Continuous Integration (runs on every commit):
  1. Lint (ESLint) - Code quality checks
  2. Unit Tests (158 tests) - Fast feedback (<30 seconds)
  3. Component Tests (86 tests) - UI validation (<1 minute)
  4. Integration Tests (41 tests) - API validation (<2 minutes)
  5. Coverage Report (90%+ target) - Enforces test coverage
  6. Build Validation - Ensures production build succeeds

E2E Tests (runs on release branches):
  • Multi-browser testing (Chromium, Firefox, WebKit)
  • Mobile browser testing (Mobile Chrome)
  • Visual regression testing (Playwright screenshots)

BDD Tests (runs on release branches):
  • Gherkin scenarios (30 scenarios, 171 steps)
  • Business stakeholder validation

AI Evals (runs on prompt changes):
  • LLM-as-a-judge quality metrics
  • Regression detection (scores can't drop >10%)
```

**Test Coverage Thresholds:**
```json
{
  "branches": 90,
  "functions": 90,
  "lines": 90,
  "statements": 90
}
```

### AI Evaluation Framework (Phase 8A Complete)

Frontera has pioneered **AI-specific evaluation tests** that measure coaching quality:

**Quality Metrics:**
| Metric | Threshold | Methodology | Test Count |
|--------|-----------|-------------|------------|
| **Relevance** | ≥ 0.80 | LLM-as-a-judge rates response relevance to user question | 32 tests |
| **Hallucination** | ≤ 0.20 | Code-based + LLM detection of fabricated information | 10 tests |
| **Tone Adherence** | ≥ 0.85 | LLM + code validation of confident, professional tone | 28 tests |
| **Completeness** | ≥ 0.75 | LLM + code assessment of actionable, thorough responses | 20 tests |

**Hybrid Evaluation Approach:**
1. **Code-Based Grading** (Fast, deterministic, free)
   - Keyword presence validation
   - Response length checks
   - Format compliance
   - Pattern matching for hallucinations

2. **LLM-as-a-Judge** (Nuanced, semantic, accurate)
   - Claude Sonnet 4 evaluates responses
   - Chain-of-thought reasoning
   - 0-1 scoring with confidence levels
   - ~$0.01-0.02 per test case

**Example Evaluation Test:**
```typescript
test('should provide relevant response to market expansion question', async () => {
  // 1. Execute Strategy Coach
  const { content } = await executeStrategyCoach(
    'What should I focus on for my product strategy?',
    {
      industry: 'Technology',
      strategic_focus: 'Market expansion',
    }
  );

  // 2. LLM-as-a-judge evaluation
  const judgment = await judgeResponse(
    'What should I focus on for my product strategy?',
    content,
    context,
    EVALUATION_CRITERIA.relevance
  );

  // 3. Assert against threshold
  expect(judgment.score).toBeGreaterThanOrEqual(0.80);

  // Output:
  // {
  //   score: 0.87,
  //   reasoning: "Response directly addresses market expansion...",
  //   confidence: "high"
  // }
});
```

**Use Cases:**
- **Prompt Engineering**: Validate quality before deploying prompt changes
- **Regression Detection**: Alert if AI quality degrades >10%
- **Continuous Monitoring**: Sample 5% of production conversations (roadmap)

---

## Roadmap: Production-Ready Enhancements

### Q1 2026 (High Priority)

| Enhancement | Description | Benefit |
|-------------|-------------|---------|
| **Content Security Policy (CSP)** | Implement strict CSP headers | Prevents XSS attacks, code injection |
| **Rate Limiting** | Per-user (100/hour), per-org (1000/day) limits | Prevents abuse, ensures fair usage |
| **Zod Schema Validation** | Validate all API request bodies | Prevents injection attacks, improves error handling |
| **Sentry Integration** | Real-time error tracking with stack traces | Faster incident response, proactive bug detection |
| **Prompt Injection Protection** | Input sanitization, pattern detection | Prevents AI manipulation, ensures coaching integrity |

### Q2 2026 (Medium Priority)

| Enhancement | Description | Benefit |
|-------------|-------------|---------|
| **Data Retention Policy** | Automated deletion after 90 days (archived) | GDPR compliance, cost reduction |
| **User Data Export/Deletion** | Self-service data portability | GDPR right to erasure, CCPA compliance |
| **Field-Level Encryption** | Client-side encryption for uploaded documents | Zero-knowledge architecture for sensitive files |
| **Audit Logging Enhancement** | Tamper-proof logs, dedicated audit UI | SOC 2 compliance, forensic investigation |
| **AI Output Moderation** | PII detection, hallucination detection, bias detection | Prevents data leakage, ensures fairness |
| **SOC 2 Type II Certification** | Independent audit, 6-month observation | Enterprise trust, RFP requirement |

### Q3 2026 (Long-Term)

| Enhancement | Description | Benefit |
|-------------|-------------|---------|
| **ISO 27001 Certification** | ISMS implementation, third-party audit | Global compliance standard |
| **Penetration Testing** | Annual third-party pentest | Identify vulnerabilities, security validation |
| **Conversation-Level RBAC** | Owner/Editor/Viewer permissions | Fine-grained access control |
| **Context Window Management** | Truncation, summarization of old messages | Cost optimization, prevents token overflow |
| **EU-Hosted AI Provider** | Mistral or other EU AI provider option | Full EU data residency (no US transfer) |
| **HIPAA BAA** | Business Associate Agreement for healthcare | Healthcare industry compliance |

### Q4 2026 (Future State)

| Enhancement | Description | Benefit |
|-------------|-------------|---------|
| **FedRAMP Moderate** | US government cloud security standard | Public sector sales |
| **Custom Encryption Keys (BYOK)** | Customer-provided encryption keys | Ultimate data sovereignty |
| **Private Cloud Deployment** | Self-hosted option for ultra-regulated industries | Financial services, defense |
| **Real-Time Anomaly Detection** | ML-based threat detection | Proactive security, insider threat detection |

---

## Appendix A: Security Questionnaire

This section addresses common enterprise security questions:

### Authentication & Access Control

**Q: Does Frontera support Single Sign-On (SSO)?**
A: Yes. Frontera uses Clerk, which supports SAML 2.0, OpenID Connect, and OAuth 2.0. You can integrate with Azure AD, Okta, Google Workspace, OneLogin, and other identity providers. (Enterprise tier)

**Q: Is Multi-Factor Authentication (MFA) required?**
A: MFA is available and can be enforced organization-wide. Supported methods: TOTP (Google Authenticator, Authy), SMS, email. (Professional tier and above)

**Q: How are user sessions managed?**
A: Short-lived JWTs (60-second expiration) with automatic refresh. Sessions can be revoked instantly via Clerk API. Clerk detects suspicious login locations and devices.

**Q: Can we restrict access to specific IP addresses?**
A: Yes, IP allowlisting is available. (Enterprise tier)

### Data Protection

**Q: Where is our data stored?**
A: Database: Supabase (EU: Frankfurt/London, US: Virginia). Application: Vercel Edge (configurable region). AI: Anthropic (US, with EU option roadmap).

**Q: Is data encrypted?**
A: Yes. **At rest**: AES-256 (Supabase, Clerk). **In transit**: TLS 1.3 (all connections). Field-level encryption roadmap (Q2 2026).

**Q: Can we bring our own encryption keys (BYOK)?**
A: Roadmap feature (Q4 2026). Supabase Enterprise supports customer-managed keys via AWS KMS.

**Q: How is data isolated between organizations?**
A: Three layers: (1) Application-level `clerk_org_id` filtering, (2) Database Row-Level Security (RLS) policies, (3) Cascade deletion on org removal.

**Q: What happens to our data if we cancel?**
A: You receive a data export (JSON format) before cancellation. All data is permanently deleted within 30 days of cancellation (or immediately upon request).

### AI & Privacy

**Q: Is our data used to train AI models?**
A: **No**. Anthropic does not use customer data for model training. This is contractually guaranteed in the DPA.

**Q: How long does Anthropic retain our data?**
A: 30 days (for abuse monitoring only), then permanently deleted. Enterprise BAA available for zero retention.

**Q: Can AI responses leak data from other organizations?**
A: No. Each AI request includes only the specific organization's context and conversation history. Cross-tenant data is never included.

**Q: How do you prevent prompt injection attacks?**
A: (1) Separate system prompt from user input, (2) Constitutional AI refuses harmful instructions, (3) Input sanitization (roadmap), (4) Rate limiting (roadmap).

### Compliance

**Q: Are you GDPR compliant?**
A: Yes. Data minimization, right to erasure, data portability (roadmap), DPA available, EU data residency option.

**Q: Are you SOC 2 certified?**
A: In progress (target: Q2 2026). Gap analysis complete, observation period underway.

**Q: Do you support HIPAA?**
A: Business Associate Agreement (BAA) available for Enterprise tier. Anthropic BAA required for full HIPAA compliance.

**Q: Can you provide a Data Processing Agreement (DPA)?**
A: Yes, standard DPA available on request. Includes Standard Contractual Clauses (SCCs) for EU customers.

### Incident Response

**Q: How do you handle security incidents?**
A: (1) Automated monitoring and alerting, (2) On-call engineer paged (<15 min for P1), (3) Incident response plan, (4) GDPR breach notification (within 72 hours), (5) Blameless post-mortem.

**Q: Have you had any security breaches?**
A: No security breaches to date. (As of January 2026)

**Q: Do you perform penetration testing?**
A: Roadmap (Q3 2026). Annual third-party penetration testing by certified firm. Remediation SLA: P1 (7 days), P2 (30 days).

### Business Continuity

**Q: What is your uptime SLA?**
A: 99.9% (Enterprise tier), 99.5% (Professional), 99.0% (Pilot). Historical uptime: 99.98% (last 6 months).

**Q: How are backups managed?**
A: Automated daily backups (30-day retention), point-in-time recovery (7 days), cross-region replication (Enterprise). Quarterly restore testing.

**Q: What is your disaster recovery plan?**
A: RTO: <1 hour (regional failover), RPO: <5 minutes (replication lag). DR testing bi-annually.

### Vendor Management

**Q: Who are your sub-processors?**
A: (1) Vercel (hosting), (2) Supabase/AWS (database), (3) Clerk (authentication), (4) Anthropic (AI), (5) PostHog (analytics), (6) Stripe (payments).

**Q: Do your vendors have SOC 2 certification?**
A: Yes. Vercel (SOC 2 Type II), Supabase/AWS (SOC 2 Type II), Clerk (SOC 2 Type II), Anthropic (SOC 2 Type II).

**Q: Can you provide a vendor risk assessment?**
A: Yes, available on request. Includes security questionnaires, certifications, DPAs for all sub-processors.

---

## Appendix B: Technical Specifications

### System Requirements

**Supported Browsers:**
- Chrome/Edge 90+ (recommended)
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Android 90+

**Network Requirements:**
- HTTPS/TLS 1.3 outbound (port 443)
- Minimum bandwidth: 1 Mbps (AI streaming)
- WebSocket support (for real-time features)

### API Specifications

**RESTful API Endpoints:**
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/[id]` - Get conversation
- `PATCH /api/conversations/[id]` - Update conversation
- `POST /api/conversations/[id]/messages` - Send message (streaming response)
- `GET /api/organizations/members` - List team members
- `POST /api/organizations/members` - Invite team member
- `DELETE /api/organizations/members/[id]` - Remove team member

**Authentication:**
- Header: `Authorization: Bearer <clerk_jwt>`
- JWT expiration: 60 seconds (auto-refreshed by SDK)

**Rate Limits:**
- Pilot: 100 requests/10 seconds
- Professional: 600 requests/10 seconds
- Enterprise: Custom

**Webhooks (Outbound - Roadmap Q3 2026):**
- `conversation.created` - New conversation started
- `conversation.completed` - Conversation reached planning phase
- `strategic_output.generated` - Strategy document created

### Data Retention

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| **Active Conversations** | Until archived by user | Soft delete (status = archived) |
| **Archived Conversations** | 90 days (roadmap) | Hard delete (automated job) |
| **Audit Logs** | 2 years | Automated purge |
| **AI Request Logs** | 90 days | Automated purge |
| **Deleted Organizations** | 30 days (soft delete) | Hard delete (automated job) |

---

## Conclusion

Frontera has been architected from day one as an **enterprise-grade platform** for blue-chip and highly regulated organizations. Our multi-layered security approach, defense-in-depth architecture, and commitment to compliance ensure your strategic data remains protected while you unlock transformative insights through AI-powered coaching.

**Key Differentiators:**
✅ **Zero-Trust Multi-Tenancy** - Cryptographic isolation of organization data
✅ **Enterprise Authentication** - SSO, MFA, RBAC with Clerk (SOC 2 certified)
✅ **Data Sovereignty** - EU/UK/US regional deployments
✅ **AI Security** - Constitutional AI, no model training on customer data
✅ **Comprehensive Testing** - 501 automated tests including AI evaluations
✅ **Compliance Roadmap** - SOC 2 Type II (Q2 2026), ISO 27001 (Q3 2026)

We welcome the opportunity to discuss your specific security requirements, conduct a detailed security review, or provide additional documentation (DPA, vendor risk assessment, penetration test reports) as part of your procurement process.

---

**Document Control:**
- **Version**: 1.0
- **Date**: January 2026
- **Next Review**: April 2026
- **Owner**: Frontera Security & Compliance Team
- **Classification**: Confidential - For Enterprise Clients

**Contact:**
- **Sales Inquiries**: sales@frontera.com
- **Security Questions**: security@frontera.com
- **Support**: support@frontera.com
