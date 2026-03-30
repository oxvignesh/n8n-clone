import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { serverClient } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

type SignInBody = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("sample@gmail.com");
  const [password, setPassword] = useState<string>("sample123");

  const signIn = useMutation({
    mutationFn: async (body: SignInBody) => {
      const res = await serverClient.api.auth["sign-in"].post(body);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      navigate("/workflows");
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    signIn.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Sign in</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                />
              </div>
              <Button
                type="submit"
                disabled={signIn.isPending}
                className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-950 transition-colors"
              >
                {signIn.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              {signIn.isError && (
                <p className="text-sm font-medium text-red-500 mt-2 text-center">
                  Invalid credentials
                </p>
              )}
            </form>
            <p className="text-sm text-zinc-400 mt-4 text-center">Don't have an account? <Link to="/sign-up" className="text-sm font-bold tracking-tight text-zinc-100">Sign up</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;