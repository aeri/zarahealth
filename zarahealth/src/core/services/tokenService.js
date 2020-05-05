import config from "../misc/config";

const OAUTH_SERVER_URI = "https://zgz.herokuapp.com/oauth/token";
const GOOGLE_OAUTH_SERVER_URI = "https://zgz.herokuapp.com/oauth/google/token";

function refreshAppToken() {
  return fetch(OAUTH_SERVER_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + config.oauth.app_auth_token,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });
}

function refreshUserToken(refreshToken) {
  return fetch(OAUTH_SERVER_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + config.oauth.user_auth_token,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
}

export function refreshAccessToken() {
  let auth = JSON.parse(localStorage.getItem("auth"));
  if (auth === null) {
    return refreshAppToken();
  }
  if (auth.refreshToken === undefined) {
    return refreshAppToken();
  } else {
    return refreshUserToken(auth.refreshToken);
  }
}

export async function handleResponse(response) {
  response = await response.json();
  if (response.access_token !== undefined) {
    let expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + response.expires_in);

    const auth = {
      ...response,
      expires_at: expires_at,
    };
    localStorage.setItem("auth", JSON.stringify(auth));
  }
}

export function getStoredAccessToken() {
  let auth = JSON.parse(localStorage.getItem("auth"));
  if (auth !== null && auth.access_token !== undefined) {
    return auth.access_token;
  } else {
    return "";
  }
}

export function isTokenValid() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth === null || auth.expires_at === undefined) {
    return false;
  }
  return Date.parse(auth.expires_at) > new Date();
}

export async function handleUserAuthentication(username, password) {
  const response = await fetch(OAUTH_SERVER_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + config.oauth.user_auth_token,
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: username,
      password: password,
    }),
  });
  await handleResponse(response);
}

export async function handleGoogleAuthentication(token) {
  const response = await fetch(GOOGLE_OAUTH_SERVER_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + config.oauth.user_auth_token,
    },
    body: new URLSearchParams({
      access_token: token,
    }),
  });
  await handleResponse(response);
}

export async function invalidateToken() {}
