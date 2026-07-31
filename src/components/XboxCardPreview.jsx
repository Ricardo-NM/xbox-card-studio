import React, { forwardRef } from "react";
import { CARD_THEMES, BADGE_OPTIONS } from "./ControlPanel";
import { Users, Gamepad2, UserPlus, Headset } from "lucide-react";

const XboxCardPreview = forwardRef(
  ({ profile, switches, themeId, badgeText }, ref) => {
    const theme = CARD_THEMES.find((t) => t.id === themeId) || CARD_THEMES[0];

    const currentBadgeObj =
      BADGE_OPTIONS.find((b) => b.id === (badgeText || "PRO PLAYER")) ||
      BADGE_OPTIONS[0];
    const BadgeIcon = currentBadgeObj?.icon || Headset;

    const hasBottomContent =
      switches.showSocial ||
      switches.showFollowers ||
      (switches.showGames &&
        profile.recentGames &&
        profile.recentGames.length > 0);

    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/* Native 1080x1920 canvas container */}
        <div className="relative overflow-hidden shadow-2xl rounded-3xl border border-slate-700/50">
          {/* Target element for 1080x1920 export */}
          <div
            ref={ref}
            id="xbox-card-canvas"
            className={`relative w-[1080px] h-[1920px] bg-gradient-to-b ${theme.bgGradient} flex flex-col justify-between p-24 select-none overflow-hidden font-sans text-white`}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {/* Darker background profile image */}
            {switches.showBackgroundProfile && profile.avatarUrl && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <img
                  src={profile.avatarUrl}
                  alt="Background Profile"
                  className="w-full h-full object-cover opacity-15 blur-md scale-150 transform translate-x-1/4"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {/* Canvas Top Header (Outside Card) - 30% opacity text */}
            <div className="relative z-10 flex items-center justify-between text-2xl font-medium tracking-wide text-white/30 pt-2">
              <span>© Xbox Card Studio</span>
              <span className="font-sans text-white/30">2026</span>
            </div>

            {/* MAIN CENTER CARD */}
            <div className="relative z-10 my-auto w-full max-w-[720px] mx-auto">
              {/* Top Floating Pill Badge (PRO PLAYER / Select) - Vertically centered on top border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div
                  className={`px-12 py-4 rounded-2xl ${theme.badgeBg} border-4 ${theme.badgeBorder} shadow-2xl flex items-center justify-center gap-3.5 text-3xl font-extrabold text-white tracking-wider uppercase whitespace-nowrap`}
                >
                  <BadgeIcon className="w-8 h-8 text-white shrink-0" />
                  <span>{badgeText || "PRO PLAYER"}</span>
                </div>
              </div>

              {/* Main Card Container */}
              <div
                className={`relative ${theme.cardBg} rounded-[52px] p-9 border border-white/10 shadow-[0_35px_80px_rgba(0,0,0,0.7)] flex flex-col gap-6 pt-12`}
              >
                {/* Main Profile 1:1 Square Avatar - With prominent soft blurred edge and glow halo */}
                {switches.showAvatar && (
                  <div
                    className={`relative w-full aspect-square mx-auto ${switches.showGamerscore ? "mb-6" : "mb-2"}`}
                  >
                    {/* Soft Blurred Glow Halo behind avatar photo */}
                    <div className="absolute -inset-3 rounded-[44px] bg-white/25 blur-xl opacity-75 pointer-events-none z-0" />

                    {/* Image Container with soft blurred border ring */}
                    <div className="relative z-10 w-full h-full rounded-[36px] overflow-hidden border-2 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.gamertag}
                        className="w-full h-full aspect-square object-cover"
                        crossOrigin="anonymous"
                      />
                      {/* Heavy Inner Vignette for soft blurred edge transition */}
                      <div
                        className="absolute inset-0 rounded-[36px] pointer-events-none z-10"
                        style={{
                          boxShadow: "inset 0 0 50px 18px rgba(0,0,0,0.7)",
                        }}
                      />
                    </div>

                    {/* Gamerscore Badge: Floating on bottom border without cut off */}
                    {switches.showGamerscore && (
                      <div
                        className={`absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 px-10 py-3.5 rounded-2xl ${theme.gsBg} border-2 ${theme.gsBorder} text-white font-black text-3xl shadow-2xl flex items-center gap-4 z-30`}
                      >
                        <div className="w-9 h-9 rounded-full bg-white text-slate-950 font-black flex items-center justify-center text-xl shadow-md">
                          G
                        </div>
                        <span>
                          {(profile.gamerscore || 0).toLocaleString("en-US")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Gamertag & Real Name / Gamerscore Header with Dynamic Coupling */}
                <div className="flex flex-col gap-2 px-1 pt-1 w-full">
                  {/* Gamertag */}
                  {switches.showGamertag && (
                    <h2
                      className={`text-5xl font-black text-white tracking-tight leading-none m-0 truncate max-w-full ${!switches.showAvatar ? "text-left" : "text-center"}`}
                    >
                      {profile.gamertag}
                    </h2>
                  )}

                  {/* Case 1: Avatar is VISIBLE */}
                  {switches.showAvatar &&
                    switches.showRealName &&
                    profile.realName && (
                      <div className="flex items-center justify-center gap-2.5 font-semibold text-2xl text-white/90">
                        <span className="w-3.5 h-3.5 rounded-full bg-lime-500 shadow-[0_0_10px_#84cc16]" />
                        <span>{profile.realName}</span>
                      </div>
                    )}

                  {/* Case 2: Avatar is HIDDEN */}
                  {!switches.showAvatar &&
                    ((switches.showRealName && profile.realName) ||
                      switches.showGamerscore) && (
                      <div
                        className={`flex items-center w-full pt-1 ${switches.showRealName && profile.realName ? "justify-between" : "justify-start"}`}
                      >
                        {/* Real name on the left if enabled */}
                        {switches.showRealName && profile.realName && (
                          <div className="flex items-center gap-2.5 font-semibold text-2xl text-white/90">
                            <span className="w-3.5 h-3.5 rounded-full bg-lime-500 shadow-[0_0_10px_#84cc16]" />
                            <span>{profile.realName}</span>
                          </div>
                        )}

                        {/* Gamerscore WITHOUT BORDER */}
                        {switches.showGamerscore && (
                          <div
                            className={`px-6 py-2.5 rounded-2xl bg-slate-900/80 border-0 text-white font-black text-2xl flex items-center gap-3 shadow-lg ${switches.showRealName && profile.realName ? "ml-auto" : ""}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-white text-slate-950 font-black flex items-center justify-center text-base shadow-md">
                              G
                            </div>
                            <span>
                              {(profile.gamerscore || 0).toLocaleString(
                                "en-US",
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Bottom Card Content: Social & Recent Games Container (Only rendered if there is content to show) */}
                {hasBottomContent && (
                  <div className="bg-[#0b0d14]/90 rounded-[36px] p-7 border border-white/5 flex flex-col gap-6">
                    {/* Dynamic Amigos & Seguidores Grid */}
                    {(switches.showSocial || switches.showFollowers) && (
                      <div
                        className={`grid ${switches.showSocial && switches.showFollowers ? "grid-cols-2" : "grid-cols-1"} gap-4 w-full`}
                      >
                        {switches.showSocial && (
                          <div className="flex items-center p-4 rounded-2xl bg-[#121522] border border-white/5 w-full">
                            <div className={`p-3.5 rounded-2xl ${theme.socialBadge} border flex-shrink-0 transition-colors duration-300`}>
                              <Users className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col items-center justify-center text-center flex-1">
                              <span className="text-slate-400 text-lg font-semibold leading-tight block">
                                Amigos
                              </span>
                              <span className="text-3xl font-extrabold text-white leading-tight">
                                {(profile.friendsCount ?? 0).toLocaleString(
                                  "en-US",
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {switches.showFollowers && (
                          <div className="flex items-center p-4 rounded-2xl bg-[#121522] border border-white/5 w-full">
                            <div className={`p-3.5 rounded-2xl ${theme.socialBadge} border flex-shrink-0 transition-colors duration-300`}>
                              <UserPlus className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col items-center justify-center text-center flex-1">
                              <span className="text-slate-400 text-lg font-semibold leading-tight block">
                                Seguidores
                              </span>
                              <span className="text-3xl font-extrabold text-white leading-tight">
                                {(profile.followersCount ?? 0).toLocaleString(
                                  "en-US",
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Top 3 Recent Games List */}
                    {switches.showGames &&
                      profile.recentGames &&
                      profile.recentGames.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <span className="text-slate-300 text-lg font-extrabold uppercase tracking-wider flex items-center justify-center text-center gap-3 w-full">
                            <Gamepad2 className={`w-7 h-7 ${theme.accentColor} transition-colors duration-300`} />{" "}
                            ACTIVIDAD DE JUEGO RECIENTE
                          </span>

                          <div className="grid grid-cols-3 gap-4">
                            {profile.recentGames
                              .slice(0, 3)
                              .map((game, idx) => (
                                <div
                                  key={game.id || idx}
                                  className="flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-[#121522] border border-white/5 shadow-lg text-center"
                                >
                                  <img
                                    src={game.coverUrl}
                                    alt={game.title}
                                    className="w-full aspect-square rounded-xl object-cover border border-white/10 shadow-md"
                                    crossOrigin="anonymous"
                                  />
                                  <span className="text-base font-bold text-white leading-tight line-clamp-2">
                                    {game.title}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Bottom Footer (Outside Card) - 30% opacity text */}
            <div className="relative z-10 flex items-center justify-center gap-2 text-2xl font-medium text-white/30 pb-2">
              <span>Desarrollado por</span>
              <svg
                className="w-7 h-7 fill-current inline-block mx-1 text-white/30"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="font-bold">Ricardo-NM</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

XboxCardPreview.displayName = "XboxCardPreview";

export default XboxCardPreview;
