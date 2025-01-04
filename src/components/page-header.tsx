"use client";

import React, { useState } from 'react';

import { LoginForm } from "@/components/login-form";
import { Search } from "lucide-react";

export function PageHeader() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-sidebar-primary text-sidebar-foreground shadow w-full">
      <div className="flex items-center space-x-4 flex-1">
      <div className="sidebar-header">
          <h1 className="app-title">I-Send</h1>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-3/4 pl-10 pr-4 py-2 rounded bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 rounded text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring">
          Sign up
        </button>
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 rounded text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
        >
          Log in
        </button>
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