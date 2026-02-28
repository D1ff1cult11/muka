import { login, signInWithGoogle } from './actions'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white selection:bg-neutral-800">
            <div className="w-full max-w-md p-8 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-center text-neutral-100">Welcome back</h1>
                <p className="text-sm text-neutral-400 mb-8 text-center">Log in to your account</p>

                <form className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-300" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            suppressHydrationWarning
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
                            suppressHydrationWarning
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-neutral-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        formAction={login}
                        suppressHydrationWarning
                        className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-neutral-900 font-medium rounded-lg transition-colors font-semibold"
                    >
                        Log in
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center space-x-2">
                    <div className="h-px bg-neutral-800 flex-1"></div>
                    <span className="text-xs text-neutral-500 uppercase font-medium tracking-wider">or continue with</span>
                    <div className="h-px bg-neutral-800 flex-1"></div>
                </div>

                <form className="mt-6">
                    <button
                        formAction={signInWithGoogle}
                        suppressHydrationWarning
                        className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-3"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2403 0 12.0003 0C7.31028 0 3.25527 2.69 1.25027 6.65L5.20528 9.715C6.13028 6.78502 8.81028 4.75 12.0003 4.75Z" fill="#EA4335" />
                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.6499C0.465 8.2799 0 10.0899 0 11.9999C0 13.9099 0.465 15.7199 1.28 17.3499L5.26498 14.2949Z" fill="#FBBC05" />
                            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.81037 19.245 6.13037 17.21 5.20537 14.28L1.25037 17.345C3.25537 21.305 7.31037 24.0001 12.0004 24.0001Z" fill="#34A853" />
                        </svg>
                        Google
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-400">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="text-white hover:underline transition-all">Sign up</a>
                </p>
            </div>
        </div>
    )
}
