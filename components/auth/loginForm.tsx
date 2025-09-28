"use client"

import { z } from "zod"
import { useSearchParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogIn } from "lucide-react"

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const envOk = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    [],
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: FormValues) {
    console.log(values)
    // if (!envOk) return
    // setError(null)
    // setLoading(true)
    // try {
    //   const supabase = getSupabaseBrowserClient()
    //   const { error } = await supabase.auth.signInWithPassword({
    //     email: values.email,
    //     password: values.password,
    //   })
    //   if (error) {
    //     setError(error.message)
    //     return
    //   }
    //   const redirectTo = searchParams.get("redirectedFrom") || "/dashboard"
    //   router.replace(redirectTo)
    // } catch (e: any) {
    //   setError(e?.message || "Unexpected error")
    // } finally {
    //   setLoading(false)
    // }
  }

  const envMissing = !envOk || searchParams.get("env") === "missing"

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-balance">Sign in to Simple CMS</CardTitle>
      </CardHeader>
      <CardContent>
        {envMissing && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Environment variables required</AlertTitle>
            <AlertDescription>
              Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Project Settings → Environment
              Variables. You can also connect the Supabase integration to add them automatically.
            </AlertDescription>
          </Alert>
        )}
        {error && !envMissing && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading || envMissing}>
              <LogIn className="size-4 mr-2" />
              {envMissing ? "Configure Supabase first" : loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {envMissing
            ? "Configure Supabase first"
            : "After configuring Supabase env vars, use your email/password to sign in."}
        </p>
      </CardFooter>
    </Card>
  )
}
