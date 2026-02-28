'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, UserPlus, RefreshCcw, Trash2, AlertTriangle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser({
                    id: user.id,
                    name: user.user_metadata?.full_name || 'Anonymous User',
                    email: user.email || ''
                })
            }
        }
        fetchUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const handleSwitchAccount = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleAddAccount = async () => {
        await supabase.auth.signOut()
        router.push('/signup')
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        const res = await fetch('/api/user', {
            method: 'DELETE',
        })

        if (res.ok) {
            await supabase.auth.signOut()
            window.location.href = '/signup'
        } else {
            const errorData = await res.json().catch(() => ({ error: 'Unknown server error.' }))
            console.error(`Failed to delete user account. Server responded with: ${errorData.error}`)
            alert(`Account deletion failed: ${errorData.error}`)
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0A] text-white">
            <header className="h-[72px] shrink-0 border-b-[0.5px] border-white/5 flex items-center px-8 bg-[#0C0C0C]/80 backdrop-blur-md">
                <h1 className="text-xl font-bold tracking-tight">Your Profile</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                {/* User Info Card */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8 mb-8 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muka-purple to-indigo-600 flex items-center justify-center shadow-2xl">
                        <span className="text-3xl font-black text-white mix-blend-overlay">
                            {user?.name?.substring(0, 2).toUpperCase() || <User className="w-10 h-10" />}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-zinc-100 mb-1">{user?.name || 'Loading...'}</h2>
                        <p className="text-zinc-500 font-mono text-sm">{user?.email || 'Loading...'}</p>
                    </div>
                </div>

                {/* Account Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <button
                        onClick={handleSwitchAccount}
                        className="flex items-center gap-4 p-5 bg-[#111] hover:bg-[#151515] border border-white/5 rounded-xl transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <RefreshCcw className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-zinc-200">Switch Account</h3>
                            <p className="text-xs text-zinc-500 mt-1">Sign in with a different user</p>
                        </div>
                    </button>

                    <button
                        onClick={handleAddAccount}
                        className="flex items-center gap-4 p-5 bg-[#111] hover:bg-[#151515] border border-white/5 rounded-xl transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-zinc-200">Add New Account</h3>
                            <p className="text-xs text-zinc-500 mt-1">Register a new profile</p>
                        </div>
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 p-5 bg-[#111] hover:bg-[#151515] border border-white/5 rounded-xl transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-zinc-700 group-hover:text-zinc-200">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-zinc-200">Sign Out</h3>
                            <p className="text-xs text-zinc-500 mt-1">End your current session</p>
                        </div>
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-900/30 bg-red-950/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-red-500 mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Danger Zone
                            </h3>
                            <p className="text-sm text-red-500/70">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="shrink-0 px-6 py-3 bg-red-950/50 hover:bg-red-900/80 text-red-400 font-bold rounded-lg border border-red-900/50 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <AlertTriangle className="w-12 h-12 text-cyber-red mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-center mb-2">Are you absolutely sure?</h2>
                            <p className="text-zinc-400 text-center text-sm mb-8 leading-relaxed">
                                This action cannot be undone. This will permanently delete your
                                account, settings, and remove all your data from our servers.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-cyber-red hover:bg-[#FF4D7D] text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, delete it'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
