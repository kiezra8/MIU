import React from "react";
import { ProductVerificationBadge } from "@/types/marketplace";
import { CheckCircle2, ShieldCheck, Leaf, Hammer, Sparkles, Cpu } from "lucide-react";

interface VerifiedBadgeProps {
  badge: ProductVerificationBadge;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  badge,
  size = "sm",
  showLabel = true,
}) => {
  if (badge === "standard") return null;

  const config = {
    verified_made_in_uganda: {
      label: "Verified Made in Uganda",
      shortLabel: "Verified MIU",
      icon: ShieldCheck,
      bgColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
      iconColor: "text-emerald-700",
    },
    locally_grown: {
      label: "100% Locally Grown",
      shortLabel: "Locally Grown",
      icon: Leaf,
      bgColor: "bg-green-50 text-green-800 border-green-300",
      iconColor: "text-green-700",
    },
    locally_manufactured: {
      label: "Locally Manufactured",
      shortLabel: "Manufactured in UG",
      icon: Hammer,
      bgColor: "bg-blue-50 text-blue-800 border-blue-200",
      iconColor: "text-blue-700",
    },
    handcrafted: {
      label: "Handcrafted Artisan",
      shortLabel: "Handcrafted",
      icon: Sparkles,
      bgColor: "bg-amber-50 text-amber-900 border-amber-300",
      iconColor: "text-amber-700",
    },
    locally_assembled: {
      label: "Locally Assembled",
      shortLabel: "Assembled in UG",
      icon: Cpu,
      bgColor: "bg-slate-50 text-slate-800 border-slate-300",
      iconColor: "text-slate-700",
    },
    locally_processed: {
      label: "Locally Processed Produce",
      shortLabel: "Processed in UG",
      icon: Sparkles,
      bgColor: "bg-teal-50 text-teal-800 border-teal-300",
      iconColor: "text-teal-700",
    },
  }[badge];

  if (!config) return null;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "text-[10px] py-0.5 px-1.5 gap-1",
    md: "text-xs py-1 px-2.5 gap-1.5",
    lg: "text-sm py-1.5 px-3 gap-2 font-medium",
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${config.bgColor} ${sizeClasses}`}
      title={config.label}
    >
      <IconComponent size={iconSizes} className={config.iconColor} />
      {showLabel && (
        <span className="truncate">
          {size === "sm" ? config.shortLabel : config.label}
        </span>
      )}
    </span>
  );
};
