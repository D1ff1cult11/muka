'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/signup?error=Could not create user')
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin');
    const redirectUrl = origin ? `${origin}/auth/callback` : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}
