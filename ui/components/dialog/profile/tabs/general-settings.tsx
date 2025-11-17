"use client";

import { Moon, Sun, Monitor, LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: LucideIcon;
}

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function GeneralSettingsTab() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-brand-text/60 text-sm">
          Customize your Fazerlane experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-base font-semibold">Appearance</Label>
          <p className="text-brand-text/60 text-sm">
            Choose how Fazerlane looks to you
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Icon
                  className={`size-6 ${isActive ? "text-primary" : "text-brand-text/60 dark:text-accent"}`}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
