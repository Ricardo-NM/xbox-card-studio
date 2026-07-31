import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import ControlPanel from "./components/ControlPanel";
import XboxCardPreview from "./components/XboxCardPreview";
import {
  parseTokenOrCodeFromUrl,
  authenticateAndFetchXboxProfile,
  getMicrosoftLoginUrl,
} from "./services/xboxAuth";
import { downloadCardAsJpeg } from "./utils/exporter";
import { DEFAULT_EMPTY_PROFILE } from "./mock/demoData";
import {
  Sparkles,
  ImageDown,
  RefreshCw,
  Image as ImageIcon,
  Star,
} from "lucide-react";

export default function App() {
  const azureClientId = (import.meta.env.VITE_AZURE_CLIENT_ID || "").trim();
  const [profile, setProfile] = useState(DEFAULT_EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiSource, setApiSource] = useState("Xbox Live OAuth Oficial");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [repoStars, setRepoStars] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/Ricardo-NM/xbox-card-studio")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setRepoStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  const formatStars = (count) => {
    return (count || 0).toLocaleString("en-US");
  };

  // Customization Switches matching exact requirements (showGames: false by default)
  const [switches, setSwitches] = useState({
    showAvatar: true,
    showGamerscore: true,
    showGamertag: true,
    showRealName: true,
    showSocial: true,
    showFollowers: true,
    showGames: false,
    showBackgroundProfile: true,
  });

  const [currentTheme, setCurrentTheme] = useState("crimson");
  const [badgeText, setBadgeText] = useState("PRO PLAYER");

  const cardRef = useRef(null);

  // Check for Microsoft OAuth Token or Code in URL on redirect
  useEffect(() => {
    async function checkAuthRedirect() {
      const accessToken = await parseTokenOrCodeFromUrl(azureClientId);
      if (accessToken) {
        handleProcessOAuthLogin(accessToken);
      }
    }
    checkAuthRedirect();
  }, [azureClientId]);

  const handleProcessOAuthLogin = async (msAccessToken) => {
    setIsLoading(true);
    try {
      const result = await authenticateAndFetchXboxProfile(msAccessToken);
      if (result && result.success && result.data) {
        setProfile(result.data);
        setIsLiveApi(true);
        setIsLoggedIn(true);
        setApiSource(result.source || "Xbox Live OAuth Oficial");
      } else {
        throw new Error(result?.error || "No se pudo obtener la información del perfil");
      }
    } catch (err) {
      console.error("Error in Xbox Live OAuth authentication:", err);
      alert(
        "Ocurrió un error al autenticar con Xbox Live. Por favor intenta de nuevo.",
      );
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleXboxLogin = async () => {
    setIsLoading(true);
    try {
      const loginUrl = await getMicrosoftLoginUrl(azureClientId);
      window.location.href = loginUrl;
    } catch (err) {
      console.error("Error generating Microsoft login URL:", err);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pkce_code_verifier");
    setIsLoggedIn(false);
    setIsLiveApi(false);
    setProfile(DEFAULT_EMPTY_PROFILE);
  };

  const handleDownloadJpeg = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      await downloadCardAsJpeg(cardRef.current, profile.gamertag);
    } catch (err) {
      alert(
        "Hubo un inconveniente al generar la imagen JPEG. Por favor intenta de nuevo.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-white selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        isLiveApi={isLiveApi}
        apiSource={apiSource}
        isLoggedIn={isLoggedIn}
        profile={profile}
        isLoading={isLoading}
        onXboxLogin={handleXboxLogin}
        onLogout={handleLogout}
        repoStars={repoStars}
      />

      {/* Main Workspace - Directly Opens Studio Customization View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 pt-16 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20 flex flex-col justify-center">
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* 2-Column Grid: Left Controls, Right Card Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls Column (First on mobile & desktop) */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-1 flex flex-col items-center justify-center w-full">
              <ControlPanel
                azureClientId={azureClientId}
                onXboxLogin={handleXboxLogin}
                isLoading={isLoading}
                switches={switches}
                setSwitches={setSwitches}
                profile={profile}
                setProfile={setProfile}
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
                badgeText={badgeText}
                setBadgeText={setBadgeText}
              />
            </div>

            {/* Card Canvas Column (Second on mobile & desktop) */}
            <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-2 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center w-full">
                {/* Scaled Preview without outer container box or side padding */}
                <div className="relative w-[340px] xs:w-[380px] sm:w-[410px] aspect-[9/16] overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  {/* CSS Scale container matching exact aspect ratio */}
                  <div
                    className="origin-top flex items-center justify-center transition-transform duration-300"
                    style={{
                      width: "1080px",
                      height: "1920px",
                      transform: "scale(0.37963)",
                      transformOrigin: "top center",
                      marginBottom: "-1191px",
                    }}
                  >
                    <XboxCardPreview
                      ref={cardRef}
                      profile={profile}
                      switches={switches}
                      themeId={currentTheme}
                      badgeText={badgeText}
                    />
                  </div>
                </div>

                {/* Download Button matching exact size and font of Cerrar sesion button */}
                <button
                  type="button"
                  onClick={handleDownloadJpeg}
                  disabled={isExporting}
                  className="mt-3.5 relative group flex items-center justify-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-transparent border-2 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span className="tracking-wide">Descargando...</span>
                    </>
                  ) : (
                    <>
                      <ImageDown className="w-4 h-4 text-white" />
                      <span className="tracking-wide">Descargar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 py-5 px-4 md:px-8 text-xs text-slate-400 mt-4 sm:mt-8 lg:mt-12 bg-slate-950/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Left Side */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© Xbox Card Studio • Desarrollado por</span>
            <a
              href="https://github.com/Ricardo-NM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 fill-current shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Ricardo-NM</span>
            </a>
          </div>

          {/* Right Side */}
          <div className="text-slate-400 font-medium">
            Autenticación Oficial Xbox Live OAuth 2.0 PKCE
          </div>
        </div>
      </footer>
    </div>
  );
}
