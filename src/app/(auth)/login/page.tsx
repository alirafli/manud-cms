import LoginForm from "../../../../components/auth/loginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh w-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
