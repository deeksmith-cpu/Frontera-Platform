import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-[#1e3a8a] hover:bg-[#1e2a5e] text-sm normal-case",
            card: "shadow-xl",
            headerTitle: "text-[#1e3a8a]",
            headerSubtitle: "text-slate-600",
          },
        }}
      />
    </div>
  );
}
