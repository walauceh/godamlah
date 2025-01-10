"use client";

import React, { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { Search } from "lucide-react";
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';

export function PageHeader() {
  const [showLogin, setShowLogin] = useState(false);

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(#00001c, #00001c) padding-box, linear-gradient(to right, #a855f7, #3b82f6) border-box',
    border: '2px solid transparent',
    transition: 'background 0.3s ease'
  };

  const verifyProof = async (proof: ISuccessResult) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proof),
      });

      if (response.ok) {
        const result = await response.json();
        return result.success;
      } else {
        const errorData = await response.json();
        throw new Error(`Error Code ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  const onSuccess = (result: ISuccessResult) => {
    window.alert(
      `Successfully verified with World ID!
      Your nullifier hash is: ${result.nullifier_hash}`
    );
    setShowLogin(true);
  };

  return (
    <header 
      className="flex items-center justify-between py-4 px-6 bg-[#00001c] text-sidebar-foreground shadow w-full"
      style={{ borderBottom: "1px solid hsl(225, 50%, 25%)" }}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="sidebar-header">
          <h1 className="app-title">I-Send</h1>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-3/4 pl-10 pr-4 py-2 rounded-full bg-transparent border-2 border-[#6366f1]/40 
              text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/60 
              transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] 
              hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-[#6366f1]/50"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          className="px-6 py-2 rounded-full text-white relative overflow-hidden group"
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right,rgb(99, 25, 168),rgb(3, 69, 175)) border-box';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(#00001c, #00001c) padding-box, linear-gradient(to right, #a855f7, #3b82f6) border-box';
          }}
        >
          Sign Up
        </button>

        <span className="inline-block">
          <IDKitWidget
            app_id="app_0e5d341b302d9411fc114e19d7dfb561"
            action="data-user-1"
            verification_level={VerificationLevel.Device}
            handleVerify={verifyProof}
            onSuccess={onSuccess}
          >
            {({ open }) => (
              <span 
                onClick={open}
                className="inline-block"
              >
                <button
                  className="px-6 py-2 rounded-full text-white relative overflow-hidden group"
                  style={buttonStyle}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, rgb(99, 25, 168), rgb(3, 69, 175)) border-box';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(#00001c, #00001c) padding-box, linear-gradient(to right, #a855f7, #3b82f6) border-box';
                  }}
                >
                  Verify with World ID
                </button>
              </span>
            )}
          </IDKitWidget>
        </span>
      </div>

      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="flex min-h-[300px] flex-col items-center justify-center bg-muted p-6 md:p-10">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}