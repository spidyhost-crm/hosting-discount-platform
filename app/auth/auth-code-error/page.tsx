import Link from "next/link"
import { LogoIcon } from "@/components/tailark/logo"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Error - Hosting Discount',
  description: 'There was an error during the authentication process. Please try again.',
}

export default function AuthCodeErrorPage() {
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
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Authentication Error</CardTitle>
            <CardDescription>
              There was an error during the authentication process. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Try Again
                </Link>
              </Button>
              <div className="text-center text-sm">
                Need help?{" "}
                <Link href="/contact" className="underline underline-offset-4">
                  Contact Support
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}