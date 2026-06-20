import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send you a reset link.
        </p>
      </div>
      <div className="grid gap-6">
        <form action={forgotPassword}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            {searchParams?.error && (
              <p className="text-sm text-destructive text-center">
                {searchParams.error}
              </p>
            )}
            {searchParams?.success && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                {searchParams.success}
              </p>
            )}
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-primary underline underline-offset-4"
        >
          Back to login
        </Link>
      </p>
    </>
  );
}
