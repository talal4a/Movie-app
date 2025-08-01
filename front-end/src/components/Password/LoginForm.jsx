import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
export default function LoginForm({handleSubmit,formData,handleChange,mutation}) {
  return (
    <form
          onSubmit={handleSubmit}
          className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
        >
          <Card className="bg-transparent text-white shadow-md border-none">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Log In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-sm text-zinc-400 text-center">
                <span>New to Cineverse? </span>
                <Link
                  to="/auth/signup"
                  className="text-white hover:underline font-medium"
                >
                  Sign up now
                </Link>
              </div>
              <div className="text-xs text-zinc-500 text-center pt-2">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
  )
}
