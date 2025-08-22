import Link from "next/link"
import { LogoIcon } from "@/components/tailark/logo"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password - Hosting Discount | Forgot Your Password',
  description: 'Reset your Hosting Discount account password. Enter your email to receive a secure password reset link and regain access to exclusive hosting deals.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-gradient-to-br from-[#9B99FE]/20 via-background via-70% to-[#2BC8B7]/20 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <LogoIcon className="size-6" />
          Hosting Discount
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}