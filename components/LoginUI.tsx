"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Mail01Icon, 
  LockIcon, 
  ViewIcon, 
  ViewOffIcon, 
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";

interface LoginUIProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginUI({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit
}: LoginUIProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-devkit-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-devkit-blue/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[460px] relative z-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* The Card */}
        <div className="bg-devkit-bg-subtle/40 backdrop-blur-2xl border border-devkit-bg-muted/50 rounded-[28px] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-devkit-accent/5 via-transparent to-devkit-blue/5 pointer-events-none" />
          
          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group/logo">
              <div className="w-11 h-11 bg-devkit-accent rounded-xl grid grid-cols-2 gap-[4px] p-[10px] transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3 shadow-lg shadow-devkit-accent/25">
                <span className="bg-white rounded-[2.5px]" />
                <span className="bg-white/50 rounded-[2.5px]" />
                <span className="bg-white/50 rounded-[2.5px]" />
                <span className="bg-white/25 rounded-[2.5px]" />
              </div>
            </Link>
            <h1 className="text-[32px] font-display text-devkit-text leading-tight mb-2 tracking-tight">Welcome back</h1>
            <p className="text-[14px] text-devkit-text-secondary leading-relaxed">
              Sign in to manage your kits and vision.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-[12px] font-mono text-devkit-text/60 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-devkit-text-tertiary group-focus-within/input:text-devkit-accent transition-colors duration-300">
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-devkit-bg/40 border border-devkit-accent/15 rounded-xl py-3 pl-12 pr-4 text-[14px] text-devkit-text placeholder:text-devkit-text-tertiary/50 focus:outline-none focus:border-devkit-accent/40 focus:ring-4 focus:ring-devkit-accent/5 transition-all duration-300 hover:bg-devkit-bg/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[12px] font-mono text-devkit-text/60 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-[12px] text-devkit-accent-secondary hover:text-devkit-accent transition-colors font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-devkit-text-tertiary group-focus-within/input:text-devkit-accent transition-colors duration-300">
                  <HugeiconsIcon icon={LockIcon} size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-devkit-bg/40 border border-devkit-accent/15 rounded-xl py-3 pl-12 pr-12 text-[14px] text-devkit-text placeholder:text-devkit-text-tertiary/50 focus:outline-none focus:border-devkit-accent/40 focus:ring-4 focus:ring-devkit-accent/5 transition-all duration-300 hover:bg-devkit-bg/60"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-devkit-text-tertiary hover:text-devkit-text transition-colors"
                  tabIndex={-1}
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-[13px] text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-devkit-accent text-white rounded-xl py-3.5 text-[14px] font-semibold hover:bg-[#8d82f8] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group/btn shadow-[0_10px_30px_rgba(124,111,247,0.3)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue to dashboard
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-2 relative z-10 my-10">
            <button 
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-devkit-accent/20 bg-white/5 dark:bg-white/[0.03] hover:bg-white/10 dark:hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-[13px] font-medium text-devkit-text group/social cursor-pointer"
            >
              <Image src="/icons/google.png" alt="Google" width={18} height={18} />
              Google
            </button>
            <button 
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-devkit-accent/20 bg-white/5 dark:bg-white/[0.03] hover:bg-white/10 dark:hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-[13px] font-medium text-devkit-text group/social cursor-pointer"
            >
              <Image src="/icons/github.png" alt="GitHub" width={18} height={18} className="dark:invert opacity-80 group-hover/social:opacity-100 transition-opacity" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[14px] text-devkit-text-secondary">
          New to the market?{" "}
          <Link href="/register" className="text-devkit-accent-secondary font-semibold hover:text-devkit-accent transition-colors underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>

        {/* Footer info */}
        <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] text-devkit-text-tertiary font-mono leading-relaxed max-w-[320px] mx-auto uppercase tracking-widest">
            Protected by DevShield Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
