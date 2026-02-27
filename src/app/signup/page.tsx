import { signup } from '../login/actions'

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white selection:bg-neutral-800">
            <div className="w-full max-w-md p-8 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-center text-neutral-100">Create Account</h1>
                <p className="text-sm text-neutral-400 mb-8 text-center">Sign up to get started</p>

                <form className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-300" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-neutral-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-300" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-neutral-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        formAction={signup}
                        className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-neutral-900 font-medium rounded-lg transition-colors font-semibold"
                    >
                        Sign up
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-white hover:underline transition-all">Log in</a>
                </p>
            </div>
        </div>
    )
}
