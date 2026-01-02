// Counter for unique IDs
let userIdCounter = 1;

// Mock user type
export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  createdAt: string;
}

// Mock organization member type
export interface MockOrgMember {
  id: string;
  userId: string;
  orgId: string;
  role: 'org:admin' | 'org:member';
  user: MockUser;
  createdAt: string;
}

// Create a mock user
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => {
  const id = `user_test_${userIdCounter++}`;
  const firstName = overrides.firstName || 'Test';
  const lastName = overrides.lastName || 'User';
  return {
    id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `test${userIdCounter}@example.com`,
    imageUrl: 'https://example.com/avatar.png',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

// Create a mock organization member
export const createMockOrgMember = (
  overrides: Partial<MockOrgMember> = {}
): MockOrgMember => {
  const user = overrides.user || createMockUser();
  return {
    id: `mem_test_${userIdCounter}`,
    userId: user.id,
    orgId: 'org_test456',
    role: 'org:member',
    user,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

// Create a list of mock org members
export const createMockOrgMemberList = (count: number = 3): MockOrgMember[] => {
  const members: MockOrgMember[] = [];

  // First member is always admin
  members.push(
    createMockOrgMember({
      role: 'org:admin',
      user: createMockUser({ firstName: 'Admin', lastName: 'User' }),
    })
  );

  // Rest are regular members
  for (let i = 1; i < count; i++) {
    members.push(
      createMockOrgMember({
        user: createMockUser({ firstName: `Member${i}`, lastName: 'User' }),
      })
    );
  }

  return members;
};

// Create mock sign-up data
export const createMockSignUpData = (overrides: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}> = {}) => ({
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@acme.com',
  password: 'SecurePass123!',
  organizationName: 'Acme Corporation',
  ...overrides,
});

// Reset factory counters
export const resetUserFactories = () => {
  userIdCounter = 1;
};
