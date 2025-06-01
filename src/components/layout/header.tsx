
"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/contexts/i18n-provider";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isOnline: boolean;
}

export function Header({ isOnline: initialIsOnline }: HeaderProps) {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
    setIsOnline(navigator.onLine); // Get actual online status on client
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-primary">{t('appName')}</h1>
        <div className="flex items-center space-x-2">
          {clientRendered && (
            <Badge variant={isOnline ? "secondary" : "destructive"} className="hidden sm:flex items-center gap-1">
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              {isOnline ? "Online" : t('connectionOffline')}
            </Badge>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

