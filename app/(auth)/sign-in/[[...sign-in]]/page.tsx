"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/shared/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FaApple } from "react-icons/fa";

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/dashboard");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    } else if (
      signIn.status === "needs_second_factor" ||
      signIn.status === "needs_client_trust"
    ) {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor: { strategy: string }) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  };

  const handleOAuth = async (strategy: OAuthStrategy) => {
    await signIn.sso({
      strategy,
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/dashboard",
    });
  };

  if (signIn.status === "complete" || isSignedIn) {
    return null;
  }

  return (
    <div className="w-[92%] sm:w-full max-w-md mx-auto shadow-2xl bg-[#E3E3E3]/80 backdrop-blur-xl border border-white/50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            Welcome Back
        </h1>
        <p className="text-[#1A1A1A]/60 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
        Login to continue your journey as a founder.
        </p>
      </div>

      {errors?.global && (
        <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs sm:text-sm font-medium">
          {errors.global[0]?.message}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <button
          onClick={() => handleOAuth("oauth_apple")}
          disabled={fetchStatus === "fetching"}
          className="w-full flex items-center justify-center gap-3 bg-white/60 border border-white hover:bg-white text-[#1A1A1A] font-bold rounded-xl py-2.5 sm:py-3.5 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm uppercase tracking-widest disabled:opacity-50"
        >
          {fetchStatus === "fetching" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
           <FaApple size={20} />
          )}
          Sign in with Apple
        </button>
        <button
          onClick={() => handleOAuth("oauth_google")}
          disabled={fetchStatus === "fetching"}
          className="w-full flex items-center justify-center gap-3 bg-white/60 border border-white hover:bg-white text-[#1A1A1A] font-bold rounded-xl py-2.5 sm:py-3.5 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm uppercase tracking-widest disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
        <button
          onClick={() => handleOAuth("oauth_github")}
          disabled={fetchStatus === "fetching"}
          className="w-full flex items-center justify-center gap-3 bg-white/60 border border-white hover:bg-white text-[#1A1A1A] font-bold rounded-xl py-2.5 sm:py-3.5 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm uppercase tracking-widest disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          Sign in with GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="h-[1px] flex-1 bg-black/10" />
        <span className="text-[#1A1A1A]/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          Or
        </span>
        <div className="h-[1px] flex-1 bg-black/10" />
      </div>

      <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#1A1A1A] font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            className="bg-white/50 border border-white/60 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-[#1A1A1A] font-medium focus:border-[#FF6803] focus:ring-2 focus:ring-[#FF6803]/20 outline-none transition-all placeholder:text-[#1A1A1A]/30 shadow-inner"
            placeholder="you@example.com"
          />
          {errors?.fields?.identifier && (
            <p className="text-red-500 text-xs">
              {errors.fields.identifier.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[#1A1A1A] font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="bg-white/50 border border-white/60 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-[#1A1A1A] font-medium focus:border-[#FF6803] focus:ring-2 focus:ring-[#FF6803]/20 outline-none transition-all placeholder:text-[#1A1A1A]/30 shadow-inner"
            placeholder="••••••••"
          />
          {errors?.fields?.password && (
            <p className="text-red-500 text-xs">
              {errors.fields.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={fetchStatus === "fetching"}
          className="w-full flex justify-center items-center h-[52px] bg-[#1A1A1A] hover:bg-[#FF6803] text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_8px_24px_rgba(26,26,26,0.2)] hover:shadow-[0_12px_32px_rgba(255,104,3,0.35)] hover:-translate-y-0.5 mt-2 sm:mt-4 disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:bg-[#1A1A1A]"
        >
          {fetchStatus === "fetching" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Continue"
          )}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center text-[#1A1A1A]/60 font-medium text-xs sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#FF6803] font-bold hover:text-[#FF8A3D] hover:underline transition-colors uppercase tracking-wide"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
