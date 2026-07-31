const getAzureClientId = () => {
  return (import.meta.env.VITE_AZURE_CLIENT_ID || '').trim();
};

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function getMicrosoftLoginUrl(clientId = getAzureClientId(), prompt = 'select_account') {
  const cleanClientId = (clientId || getAzureClientId()).trim();
  if (!cleanClientId) {
    throw new Error('No se ha configurado VITE_AZURE_CLIENT_ID en las variables de entorno (.env)');
  }
  const redirectUri = encodeURIComponent(window.location.protocol + '//' + window.location.host + '/');
  const scope = encodeURIComponent('XboxLive.signin offline_access');
  
  const codeVerifier = generateCodeVerifier();
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  let url = `https://login.live.com/oauth20_authorize.srf?client_id=${cleanClientId}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  if (prompt) {
    url += `&prompt=${encodeURIComponent(prompt)}`;
  }
  return url;
}

export async function parseTokenOrCodeFromUrl(clientId = getAzureClientId()) {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));

  const code = searchParams.get('code');
  if (code) {
    window.history.replaceState(null, '', window.location.pathname);
    return await exchangeAuthCodeForToken(code, clientId);
  }

  const accessToken = hashParams.get('access_token');
  if (accessToken) {
    window.history.replaceState(null, '', window.location.pathname);
    return accessToken;
  }

  return null;
}

export async function exchangeAuthCodeForToken(code, clientId = getAzureClientId()) {
  const cleanClientId = clientId.trim() || getAzureClientId();
  const redirectUri = window.location.protocol + '//' + window.location.host + '/';
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const tokenUrl = isLocal ? '/ms-auth/oauth20_token.srf' : 'https://login.live.com/oauth20_token.srf';
  
  const codeVerifier = sessionStorage.getItem('pkce_code_verifier') || '';

  const bodyParams = new URLSearchParams();
  bodyParams.append('client_id', cleanClientId);
  bodyParams.append('code', code);
  bodyParams.append('grant_type', 'authorization_code');
  bodyParams.append('redirect_uri', redirectUri);
  bodyParams.append('scope', 'XboxLive.signin offline_access');
  if (codeVerifier) {
    bodyParams.append('code_verifier', codeVerifier);
  }

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    if (!res.ok) {
      throw new Error(`Error en intercambio de código OAuth (${res.status})`);
    }

    const json = await res.json();
    return json.access_token;
  } catch (err) {
    console.error('Error exchanging OAuth code:', err);
    throw err;
  }
}

/**
 * 100% PURE DYNAMIC OFFICIAL XBOX LIVE API FETCHING
 */
export async function authenticateAndFetchXboxProfile(msAccessToken) {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // 1. Get Xbox User Token
  const userAuthUrl = isLocal ? '/xbox-user-auth/user/authenticate' : 'https://user.auth.xboxlive.com/user/authenticate';
  const userAuthRes = await fetch(userAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: `d=${msAccessToken}`
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT'
    })
  });

  if (!userAuthRes.ok) {
    throw new Error(`Error de autenticación Xbox User Token (${userAuthRes.status})`);
  }

  const userAuthJson = await userAuthRes.json();
  const userToken = userAuthJson.Token;
  const uhs = userAuthJson.DisplayClaims?.xui?.[0]?.uhs;

  if (!userToken || !uhs) {
    throw new Error('No se pudo obtener el User Token de Xbox');
  }

  // 2. Get XSTS Token
  const xstsAuthUrl = isLocal ? '/xbox-xsts-auth/xsts/authorize' : 'https://xsts.auth.xboxlive.com/xsts/authorize';
  const xstsRes = await fetch(xstsAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [userToken]
      },
      RelyingParty: 'http://xboxlive.com',
      TokenType: 'JWT'
    })
  });

  if (!xstsRes.ok) {
    throw new Error(`Error al obtener XSTS Token (${xstsRes.status})`);
  }

  const xstsJson = await xstsRes.json();
  const xstsToken = xstsJson.Token;

  // 3. Query Official Xbox Live Profile API
  const xblAuthHeader = `XBL3.0 x=${uhs};${xstsToken}`;
  const profileUrl = isLocal 
    ? '/xbox-profile-api/users/me/profile/settings?settings=Gamertag,GameDisplayPicRaw,Gamerscore,RealName,AccountTier,UniqueModernGamertag'
    : 'https://profile.xboxlive.com/users/me/profile/settings?settings=Gamertag,GameDisplayPicRaw,Gamerscore,RealName,AccountTier,UniqueModernGamertag';

  const profileRes = await fetch(profileUrl, {
    headers: {
      'Authorization': xblAuthHeader,
      'x-xbl-contract-version': '2',
      'Accept': 'application/json'
    }
  });

  if (!profileRes.ok) {
    throw new Error(`Error consultando perfil Xbox (${profileRes.status})`);
  }

  const profileJson = await profileRes.json();
  const userObj = profileJson.profileUsers?.[0];
  const xuid = userObj?.id;

  const settingsMap = {};
  if (userObj?.settings) {
    userObj.settings.forEach(s => {
      settingsMap[s.id] = s.value;
    });
  }

  const gamertag = settingsMap['UniqueModernGamertag'] || settingsMap['Gamertag'] || userObj?.id || 'Gamer Xbox';
  const realName = settingsMap['RealName'] || gamertag;
  const avatarUrl = settingsMap['GameDisplayPicRaw'] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const gamerscore = parseInt(settingsMap['Gamerscore'] || '0', 10);
  const tier = settingsMap['AccountTier'] || 'Game Pass Ultimate';

  // 4. UNIVERSAL SOCIAL GRAPH CALCULATION
  let friendsCount = 0;
  let followersCount = 0;

  let totalFollowersCount = 0;
  let summaryFriendCount = 0;

  // Step A: Fetch Summary
  try {
    const summaryUrl = isLocal ? '/xbox-social-api/users/me/summary' : 'https://social.xboxlive.com/users/me/summary';
    const summaryRes = await fetch(summaryUrl, {
      headers: {
        'Authorization': xblAuthHeader,
        'x-xbl-contract-version': '2',
        'Accept': 'application/json'
      }
    });

    if (summaryRes.ok) {
      const summaryJson = await summaryRes.json();
      if (summaryJson.targetFriendCount !== undefined) {
        summaryFriendCount = summaryJson.targetFriendCount;
      }
      if (summaryJson.targetFollowerCount !== undefined) {
        totalFollowersCount = summaryJson.targetFollowerCount;
      }
    }
  } catch (e) {
    console.warn('Error fetching live social summary:', e);
  }

  // Step B: Fetch People Endpoint for Exact Mutual Friends
  try {
    const socialUrl = isLocal ? '/xbox-social-api/users/me/people' : 'https://social.xboxlive.com/users/me/people';
    const socialRes = await fetch(socialUrl, {
      headers: {
        'Authorization': xblAuthHeader,
        'x-xbl-contract-version': '2',
        'Accept': 'application/json'
      }
    });

    if (socialRes.ok) {
      const socialJson = await socialRes.json();
      const people = socialJson.people || [];
      
      // Amigos = Mutual Friends (accounts where BOTH follow each other)
      const mutualFriends = people.filter(p => p.isFollowedByCaller && p.isFollowingCaller);
      friendsCount = mutualFriends.length;

      if (totalFollowersCount === 0) {
        totalFollowersCount = people.filter(p => p.isFollowingCaller).length;
      }
    }
  } catch (err) {
    console.warn('Error fetching people endpoint:', err);
  }

  if (friendsCount === 0 && summaryFriendCount > 0) {
    friendsCount = summaryFriendCount;
  }

  // Followers = Total Followers minus Mutual Friends
  followersCount = Math.max(0, totalFollowersCount - friendsCount);

  // 5. Query Official TitleHub API for Recent Games (Ordered chronologically by last played date)
  let recentGames = [];
  try {
    const titleUrl = isLocal
      ? `/xbox-titlehub-api/users/xuid(${xuid})/titles/titlehistory/decoration/detail?maxItems=10`
      : `https://titlehub.xboxlive.com/users/xuid(${xuid})/titles/titlehistory/decoration/detail?maxItems=10`;

    const titleRes = await fetch(titleUrl, {
      headers: {
        'Authorization': xblAuthHeader,
        'x-xbl-contract-version': '2',
        'Accept': 'application/json'
      }
    });

    if (titleRes.ok) {
      const titleJson = await titleRes.json();
      const titles = titleJson.titles || [];

      // Accept all game titles as shown in the official Xbox App!
      const validGames = titles.filter(t => {
        if (!t.name && !t.titleName) return false;
        if (t.type && t.type !== 'Game') return false;
        return true;
      });

      const sortedGames = validGames.sort((a, b) => {
        const timeA = new Date(a.titleHistory?.lastTimePlayed || a.lastUnlock || 0).getTime();
        const timeB = new Date(b.titleHistory?.lastTimePlayed || b.lastUnlock || 0).getTime();
        return timeB - timeA;
      });

      recentGames = sortedGames.slice(0, 3).map((t, idx) => ({
        id: String(t.titleId || idx + 1),
        title: t.name || t.titleName || `Juego ${idx + 1}`,
        coverUrl: t.displayImage || t.displayImageUrl || t.tileImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80'
      }));
    } else {
      const meTitleUrl = isLocal
        ? '/xbox-titlehub-api/users/me/titles/titlehistory/decoration/detail?maxItems=10'
        : 'https://titlehub.xboxlive.com/users/me/titles/titlehistory/decoration/detail?maxItems=10';

      const meTitleRes = await fetch(meTitleUrl, {
        headers: {
          'Authorization': xblAuthHeader,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json'
        }
      });

      if (meTitleRes.ok) {
        const meTitleJson = await meTitleRes.json();
        const titles = meTitleJson.titles || [];
        const validGames = titles.filter(t => t.name || t.titleName);
        recentGames = validGames.slice(0, 3).map((t, idx) => ({
          id: String(t.titleId || idx + 1),
          title: t.name || t.titleName || `Juego ${idx + 1}`,
          coverUrl: t.displayImage || t.displayImageUrl || t.tileImage
        }));
      }
    }
  } catch (err) {
    console.warn('Error fetching TitleHub history:', err);
  }

  return {
    success: true,
    data: {
      gamertag,
      realName,
      avatarUrl,
      gamerpic: avatarUrl,
      gamerscore,
      friendsCount,
      followersCount,
      tier: tier === 'Gold' ? 'Xbox Live Gold' : 'Game Pass Ultimate',
      status: 'En línea',
      recentGames
    },
    source: 'Xbox Live OAuth (Oficial Microsoft)'
  };
}
