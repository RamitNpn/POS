import LoginForm from "@/components/login/LoginForm";
import LoginHero from "@/components/login/LoginHero";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <LoginHero />
      <LoginForm />
    </main>
  );
}