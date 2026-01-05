import { vi } from 'vitest';

// Default mock auth result
export const mockAuthResult = {
  userId: 'user_test123',
  orgId: 'org_test456',
  orgRole: 'org:admin',
  sessionId: 'sess_test789',
};

// Default mock current user
export const mockCurrentUser = {
  id: 'user_test123',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  username: 'testuser',
  emailAddresses: [
    {
      id: 'email_123',
      emailAddress: 'test@example.com',
      verification: { status: 'verified' },
    },
  ],
  primaryEmailAddressId: 'email_123',
  imageUrl: 'https://example.com/avatar.png',
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
};

// Default mock organization
export const mockOrganization = {
  id: 'org_test456',
  name: 'Test Organization',
  slug: 'test-org',
  imageUrl: 'https://example.com/org-logo.png',
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  membersCount: 5,
};

// Default mock membership
export const mockMembership = {
  id: 'mem_test123',
  role: 'org:admin',
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  organization: mockOrganization,
  publicUserData: {
    userId: 'user_test123',
    identifier: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    imageUrl: 'https://example.com/avatar.png',
  },
};

// Create mock clerk client
export const createMockClerkClient = () => ({
  users: {
    createUser: vi.fn().mockResolvedValue({ ...mockCurrentUser, id: 'user_new123' }),
    getUser: vi.fn().mockResolvedValue(mockCurrentUser),
    updateUser: vi.fn().mockResolvedValue(mockCurrentUser),
    deleteUser: vi.fn().mockResolvedValue({}),
    getUserList: vi.fn().mockResolvedValue({ data: [mockCurrentUser] }),
  },
  organizations: {
    createOrganization: vi.fn().mockResolvedValue(mockOrganization),
    getOrganization: vi.fn().mockResolvedValue(mockOrganization),
    updateOrganization: vi.fn().mockResolvedValue(mockOrganization),
    deleteOrganization: vi.fn().mockResolvedValue({}),
    getOrganizationMembershipList: vi.fn().mockResolvedValue({
      data: [mockMembership],
      totalCount: 1,
    }),
    createOrganizationMembership: vi.fn().mockResolvedValue(mockMembership),
    updateOrganizationMembership: vi.fn().mockResolvedValue(mockMembership),
    deleteOrganizationMembership: vi.fn().mockResolvedValue({}),
    createOrganizationInvitation: vi.fn().mockResolvedValue({
      id: 'inv_123',
      emailAddress: 'invite@example.com',
      role: 'org:member',
      status: 'pending',
      createdAt: new Date().getTime(),
    }),
    revokeOrganizationInvitation: vi.fn().mockResolvedValue({}),
  },
  invitations: {
    createInvitation: vi.fn().mockResolvedValue({ id: 'inv_123' }),
  },
});

// Mock the Clerk server module
export const mockClerkModule = (customAuth?: Partial<typeof mockAuthResult>) => {
  const authResult = { ...mockAuthResult, ...customAuth };

  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn().mockResolvedValue(authResult),
    currentUser: vi.fn().mockResolvedValue(mockCurrentUser),
    clerkClient: vi.fn().mockResolvedValue(createMockClerkClient()),
  }));

  return { authResult, currentUser: mockCurrentUser };
};

// Mock unauthenticated state
export const mockUnauthenticated = () => {
  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn().mockResolvedValue({ userId: null, orgId: null }),
    currentUser: vi.fn().mockResolvedValue(null),
    clerkClient: vi.fn().mockResolvedValue(createMockClerkClient()),
  }));
};

// Mock non-admin user
export const mockNonAdminUser = () => {
  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn().mockResolvedValue({
      ...mockAuthResult,
      orgRole: 'org:member',
    }),
    currentUser: vi.fn().mockResolvedValue(mockCurrentUser),
    clerkClient: vi.fn().mockResolvedValue(createMockClerkClient()),
  }));
};

// Helper to get mock auth function for assertions
export const getMockAuth = () => {
  return vi.fn().mockResolvedValue(mockAuthResult);
};

// Reset Clerk mocks
export const resetClerkMocks = () => {
  vi.resetModules();
};

// Custom hook mocks for client components
export const mockClerkHooks = () => {
  vi.mock('@clerk/nextjs', () => ({
    useAuth: vi.fn().mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: mockAuthResult.userId,
      orgId: mockAuthResult.orgId,
      orgRole: mockAuthResult.orgRole,
    }),
    useUser: vi.fn().mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockCurrentUser,
    }),
    useOrganization: vi.fn().mockReturnValue({
      isLoaded: true,
      organization: mockOrganization,
      membership: mockMembership,
    }),
    useClerk: vi.fn().mockReturnValue({
      signOut: vi.fn(),
      openSignIn: vi.fn(),
      openSignUp: vi.fn(),
    }),
    SignedIn: ({ children }: { children: React.ReactNode }) => children,
    SignedOut: () => null,
    UserButton: () => null,
    OrganizationSwitcher: () => null,
  }));
};
