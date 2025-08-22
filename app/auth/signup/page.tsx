import Link from "next/link"
import { LogoIcon } from "@/components/tailark/logo"
import { SignupForm } from "@/components/signup-form"
import { ModeToggle } from "@/components/mode-toggle"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Hosting Discount | Create Your Account',
  description: 'Join Hosting Discount to access exclusive web hosting deals and compare top providers. Create your free account with GitHub, Google, or email signup.',
}

export default function SignupPage() {
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
        <SignupForm />
      </div>
    </div>
  )
}