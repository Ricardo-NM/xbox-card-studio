import React from "react";
import { RefreshCw, LogOut, Star } from "lucide-react";

export function XboxIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 372.36823 372.57281"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-1.5706619,12.357467)">
        <path
          fill="currentColor"
          d="M 169.18811,359.44924 C 140.50497,356.70211 111.4651,346.40125 86.518706,330.1252 65.614374,316.48637 60.893704,310.87967 60.893704,299.69061 c 0,-22.47524 24.711915,-61.84014 66.992496,-106.71584 24.01246,-25.48631 57.46022,-55.36001 61.0775,-54.55105 7.0309,1.57238 63.25048,56.41053 84.29655,82.2252 33.28077,40.82148 48.58095,74.24535 40.808,89.14682 -5.9087,11.32753 -42.57224,33.4669 -69.50775,41.97242 -22.19984,7.01011 -51.35538,9.9813 -75.37239,7.68108 z M 32.660004,276.3228 C 15.288964,249.67326 6.5125436,223.43712 2.2752336,185.49086 c -1.39917002,-12.53 -0.89778,-19.69701 3.17715,-45.41515 5.0788204,-32.05404 23.3330104,-69.136381 45.2671304,-91.957616 9.34191,-9.719732 10.17624,-9.956543 21.56341,-6.120482 13.828357,4.658436 28.595936,14.857457 51.498366,35.56661 l 13.36254,12.082873 -7.2969,8.96431 C 95.97448,140.22403 60.217254,199.2085 46.741444,235.70071 c -7.32599,19.83862 -10.28084,39.75281 -7.12868,48.04363 2.12818,5.59752 0.17339,3.51093 -6.95276,-7.42154 z m 304.915426,4.53255 c 1.71605,-8.37719 -0.4544,-23.76257 -5.5413,-39.28002 -11.01667,-33.60598 -47.83964,-96.12421 -81.65282,-138.63054 L 239.73699,89.563875 251.25285,78.989784 c 15.03631,-13.806637 25.47602,-22.073835 36.74025,-29.094513 8.88881,-5.540156 21.59109,-10.444558 27.05113,-10.444558 3.36626,0 15.21723,12.298726 24.78421,25.720611 14.81725,20.787711 25.71782,45.986976 31.24045,72.219686 3.56833,16.9498 3.8657,53.23126 0.57486,70.13935 -2.70068,13.87582 -8.40314,31.87484 -13.9661,44.08195 -4.16823,9.14657 -14.53521,26.91044 -19.0783,32.69074 -2.33569,2.97175 -2.33761,2.96527 -1.02393,-3.4477 z M 172.25917,33.104812 c -15.60147,-7.922671 -39.6696,-16.427164 -52.96493,-18.715209 -4.66097,-0.802124 -12.61193,-1.249474 -17.6688,-0.994114 -10.969613,0.55394 -10.479662,-0.0197 7.11783,-8.3336652 14.63023,-6.912081 26.83386,-10.976696 43.40044,-14.455218 18.6362,-3.9130858 53.66559,-3.9590088 72.00507,-0.0944 19.80818,4.174105 43.13297,12.854085 56.27623,20.9423862 l 3.90633,2.403927 -8.96247,-0.452584 c -17.81002,-0.899366 -43.76575,6.295879 -71.63269,19.857459 -8.40538,4.090523 -15.71788,7.357511 -16.25,7.25997 -0.53211,-0.09754 -7.38426,-3.43589 -15.22701,-7.418555 z"
        />
      </g>
    </svg>
  );
}

export default function Navbar({
  isLiveApi,
  apiSource,
  isLoggedIn,
  profile,
  isLoading,
  onXboxLogin,
  onLogout,
  repoStars = 0,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-2.5 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/favicon.ico"
            alt="Xbox Card Studio Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 rounded-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-extrabold tracking-tight text-white m-0 leading-none">
                Xbox <span className="text-slate-400">Card Studio</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-semibold hidden sm:block">
              Generador de tarjetas de perfil Xbox para redes sociales
            </p>
          </div>
        </div>

        {/* Right Action Block */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              {/* User Badge: Hidden on mobile (matching hidden sm:block breakpoint), visible on sm+ */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-transparent border-2 border-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.gamertag}
                    className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    🎮
                  </div>
                )}
                <span className="font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-none">
                  {profile?.gamertag || "Conectado"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="relative group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-transparent border-2 border-red-500 hover:bg-red-500 hover:border-red-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_16px_rgba(239,68,68,0.4)] active:scale-95 cursor-pointer whitespace-nowrap"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-white shrink-0" />
                <span className="tracking-wide whitespace-nowrap">
                  Cerrar sesión
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onXboxLogin}
              disabled={isLoading}
              className="relative group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-transparent border-2 border-[#107c41] hover:border-[#0fcf6d] hover:bg-[#107c41]/15 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_10px_rgba(16,124,65,0.2)] hover:shadow-[0_0_16px_rgba(16,124,65,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="font-bold tracking-wide text-slate-200">
                    Conectando...
                  </span>
                </>
              ) : (
                <>
                  <XboxIcon className="w-4 h-4" />
                  <span className="tracking-wide">Iniciar sesión</span>
                </>
              )}
            </button>
          )}

          {/* GitHub Repo Button */}
          <a
            href="https://github.com/Ricardo-NM/xbox-card-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group flex items-center justify-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-transparent border-2 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg active:scale-95 cursor-pointer shrink-0"
            title="Ver repositorio en GitHub"
          >
            <svg
              className="w-4 h-4 fill-current text-white shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 shrink-0 fill-none stroke-[2.2]" />
              <span className="tracking-wide text-white font-extrabold">
                {(repoStars || 0).toLocaleString("en-US")}
              </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
