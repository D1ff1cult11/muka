'use client'
import { useEffect, useState } from 'react'

export default function EnvCheck() {
    const [env, setEnv] = useState<any>({})

    useEffect(() => {
        setEnv({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        })
    }, [])

    return (
        <div className="p-10 bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Env Variables Check</h1>
            <pre className="bg-neutral-900 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(env, null, 2)}
            </pre>
        </div>
    )
}
