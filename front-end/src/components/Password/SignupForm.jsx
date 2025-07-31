export default function SignUpForm({
  handleSubmit,
  formData,
  handleChange,
  mutation,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md backdrop-blur-sm bg-black/70 rounded-lg"
    >
      <Card className="bg-transparent text-white shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400"
              placeholder="Confirm your password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Signing up...' : 'Sign Up'}
          </Button>
          <div className="text-sm text-zinc-400 text-center">
            <span>Already have account? </span>
            <Link
              to="/auth/login"
              className="text-white hover:underline font-medium"
            >
              Login now
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
