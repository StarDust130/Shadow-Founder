"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f4f4]">
      <Loader2 className="w-10 h-10 animate-spin text-[#FF6803] mb-4" />
      <p className="text-[#1A1A1A] font-bold uppercase tracking-widest text-sm text-center">
        Authenticating...<br/><span className="text-black/50 text-xs text-balance">Please wait while we verify your identity</span>
      </p>
      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
}
