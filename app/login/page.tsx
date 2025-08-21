import { LogoIcon } from "@/components/tailark/logo"
import { LoginForm } from "@/components/login-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Hosting Discount | Sign in to Your Account',
  description: 'Sign in to Hosting Discount to access exclusive hosting deals, compare hosting providers, and manage your account. Secure login with GitHub and Google authentication.',
}

export default function LoginPage() {
  return (
    <div className="bg-gradient-to-br from-[#9B99FE]/20 via-background via-70% to-[#2BC8B7]/20 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <LogoIcon className="size-6" />
          Hosting Discount
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
