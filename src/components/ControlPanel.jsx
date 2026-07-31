import React from "react";
import {
  Settings2,
  Download,
  Palette,
  Trophy,
  Users,
  Gamepad2,
  UserCheck,
  Sparkles,
  RefreshCw,
  Crown,
  LogIn,
  UserPlus,
  User,
  Headset,
  Crosshair,
  Gem,
  Swords,
  Binoculars,
  Handshake,
  Camera,
  IdCard,
  ImagePlus,
} from "lucide-react";

export const CARD_THEMES = [
  {
    id: "crimson",
    name: "Red Crimson",
    bgGradient: "from-[#a81010] via-[#820d0d] to-[#540707]",
    cardBg: "bg-[#0f1118]/95",
    badgeBorder: "border-[#0f1118]",
    accentColor: "text-red-500",
    activeToggleBg: "bg-red-600",
    activeThemeBorder: "border-red-500 bg-red-950/30",
    badgeBg: "bg-gradient-to-r from-red-600 via-rose-700 to-red-900 text-white",
    gsBorder: "border-[#b91c1c]",
    gsBg: "bg-[#0f1118]",
    socialBadge: "bg-red-500/20 text-red-400 border-red-400/20",
  },
  {
    id: "emerald",
    name: "Xbox Emerald",
    bgGradient: "from-emerald-700 via-emerald-900 to-slate-950",
    cardBg: "bg-slate-950/95",
    badgeBorder: "border-slate-950",
    accentColor: "text-emerald-400",
    activeToggleBg: "bg-emerald-500",
    activeThemeBorder: "border-emerald-500 bg-emerald-950/30",
    badgeBg:
      "bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-800 text-white",
    gsBorder: "border-emerald-600",
    gsBg: "bg-slate-950",
    socialBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-400/20",
  },
  {
    id: "cobalt",
    name: "Cobalt Blue",
    bgGradient: "from-blue-700 via-blue-900 to-indigo-950",
    cardBg: "bg-[#101424]/95",
    badgeBorder: "border-[#101424]",
    accentColor: "text-blue-400",
    activeToggleBg: "bg-blue-500",
    activeThemeBorder: "border-blue-500 bg-blue-950/30",
    badgeBg:
      "bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-800 text-white",
    gsBorder: "border-blue-600",
    gsBg: "bg-[#101424]",
    socialBadge: "bg-blue-500/20 text-blue-400 border-blue-400/20",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Purple",
    bgGradient: "from-purple-800 via-indigo-950 to-slate-950",
    cardBg: "bg-[#150f24]/95",
    badgeBorder: "border-[#150f24]",
    accentColor: "text-fuchsia-400",
    activeToggleBg: "bg-fuchsia-500",
    activeThemeBorder: "border-fuchsia-500 bg-purple-950/30",
    badgeBg:
      "bg-gradient-to-r from-fuchsia-600 via-purple-700 to-indigo-900 text-white",
    gsBorder: "border-purple-600",
    gsBg: "bg-[#150f24]",
    socialBadge: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-400/20",
  },
  {
    id: "obsidian",
    name: "Obsidian Gold",
    bgGradient: "from-zinc-900 via-amber-950 to-black",
    cardBg: "bg-zinc-950/95",
    badgeBorder: "border-zinc-950",
    accentColor: "text-amber-400",
    activeToggleBg: "bg-amber-500",
    activeThemeBorder: "border-amber-500 bg-amber-950/30",
    badgeBg:
      "bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-700 text-white",
    gsBorder: "border-amber-600",
    gsBg: "bg-zinc-950",
    socialBadge: "bg-amber-500/20 text-amber-400 border-amber-400/20",
  },
  {
    id: "magenta",
    name: "Neon Magenta",
    bgGradient: "from-pink-600 via-rose-950 to-slate-950",
    cardBg: "bg-[#1a0818]/95",
    badgeBorder: "border-[#1a0818]",
    accentColor: "text-pink-400",
    activeToggleBg: "bg-pink-500",
    activeThemeBorder: "border-pink-500 bg-pink-950/30",
    badgeBg:
      "bg-gradient-to-r from-pink-500 via-rose-600 to-fuchsia-800 text-white",
    gsBorder: "border-pink-600",
    gsBg: "bg-[#1a0818]",
    socialBadge: "bg-pink-500/20 text-pink-400 border-pink-400/20",
  },
];

export const BADGE_OPTIONS = [
  { id: "PRO PLAYER", label: "PRO PLAYER", icon: Headset },
  { id: "TRYHARD", label: "TRYHARD", icon: Crosshair },
  { id: "COLECCIONISTA", label: "COLECCIONISTA", icon: Gem },
  { id: "COMPETITIVO", label: "COMPETITIVO", icon: Swords },
  { id: "EXPLORADOR", label: "EXPLORADOR", icon: Binoculars },
  { id: "SOCIAL", label: "SOCIAL", icon: Handshake },
];

const SWITCH_ITEMS = [
  { key: "showAvatar", label: "Foto de perfil", icon: Camera },
  { key: "showGamerscore", label: "Gamerscore", icon: Trophy },
  { key: "showGamertag", label: "Gamertag", icon: User },
  { key: "showRealName", label: "Nombre de usuario", icon: IdCard },
  { key: "showSocial", label: "Número de amigos", icon: Users },
  { key: "showFollowers", label: "Número de seguidores", icon: UserPlus },
  { key: "showGames", label: "Top 3 juegos recientes", icon: Gamepad2 },
  {
    key: "showBackgroundProfile",
    label: "Fondo personalizado",
    icon: ImagePlus,
  },
];

export default function ControlPanel({
  onXboxLogin,
  isLoading,
  switches,
  setSwitches,
  currentTheme,
  setCurrentTheme,
  badgeText,
  setBadgeText,
  onDownload,
  isExporting,
}) {
  const toggleSwitch = (key) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeTheme =
    CARD_THEMES.find((t) => t.id === currentTheme) || CARD_THEMES[0];
  const accentColor = activeTheme.accentColor;
  const toggleBg = activeTheme.activeToggleBg;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-5 text-slate-100 transition-all duration-300 w-full">
      {/* Switch Toggles for Customizing Visible Data */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label
            className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-2 transition-colors duration-300`}
          >
            <Settings2 className="w-4 h-4" /> Personalizar card
          </label>
        </div>

        {/* 2-Column Grid x 4 Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SWITCH_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isEnabled = switches[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleSwitch(item.key)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-100"
                    : "bg-slate-950/40 border-slate-800/40 opacity-65 hover:opacity-85"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-300 shrink-0 ${
                      isEnabled
                        ? `bg-slate-900 ${accentColor}`
                        : "bg-slate-900/40 text-slate-500"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap transition-colors duration-300 ${
                      isEnabled
                        ? "font-medium text-slate-200"
                        : "font-normal text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <button
                  type="button"
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                    isEnabled ? toggleBg : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Badge Superior Customization - Button Grid matching Tema selector */}
      <div>
        <label
          className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-2 mb-2.5 transition-colors duration-300`}
        >
          <Crown className="w-4 h-4" /> Badge superior
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BADGE_OPTIONS.map((item) => {
            const IconComponent = item.icon;
            const isSelected = badgeText === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setBadgeText(item.id)}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? `${activeTheme.activeThemeBorder} text-white font-bold shadow-md`
                    : "border-slate-800 bg-slate-950/60 text-slate-400 font-medium hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <IconComponent
                  className={`w-3.5 h-3.5 shrink-0 transition-colors duration-300 ${isSelected ? accentColor : "text-slate-400"}`}
                />
                <span className="text-xs truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Presets */}
      <div>
        <label
          className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-2 mb-2.5 transition-colors duration-300`}
        >
          <Palette className="w-4 h-4" /> Tema
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CARD_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCurrentTheme(t.id)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentTheme === t.id
                  ? `${t.activeThemeBorder} text-white font-bold shadow-md`
                  : "border-slate-800 bg-slate-950/60 text-slate-400 font-medium hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-gradient-to-br ${t.bgGradient} border border-white/20 shrink-0`}
              />
              <span className="text-xs truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
