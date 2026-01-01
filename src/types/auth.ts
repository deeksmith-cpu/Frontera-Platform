// Auth-related types for custom authentication flows

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  userId?: string;
  organizationId?: string;
  error?: string;
}

export interface SignInResponse {
  success: boolean;
  error?: string;
}

// Organization member types
export interface OrganizationMember {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: string;
  createdAt: number;
}

export interface InviteMemberData {
  email: string;
  role: "org:admin" | "org:member";
}

export interface UpdateRoleData {
  role: "org:admin" | "org:member";
}

// Clerk webhook event types
export interface ClerkWebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

export interface OrganizationCreatedEvent {
  type: "organization.created";
  data: {
    id: string;
    name: string;
    slug: string;
    created_by: string;
    created_at: number;
  };
}

export interface OrganizationUpdatedEvent {
  type: "organization.updated";
  data: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface OrganizationDeletedEvent {
  type: "organization.deleted";
  data: {
    id: string;
  };
}
