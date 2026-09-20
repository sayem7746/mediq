import { loginAction } from "./actions";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">Staff sign in</h1>
      <form action={loginAction} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="tap-target rounded border px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="tap-target rounded border px-3"
          />
        </label>
        <button
          type="submit"
          className="tap-target bg-primary rounded px-4 text-white"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
