export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
export const ACCESS_TOKEN_KEY = "via-token";
export const REFRESH_TOKEN_KEY = "via-refresh-token";
export const USER_KEY = "via-user";
export const ROLE_KEY = "via-role";

let refreshPromise = null;

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function setAuthSession({ accessToken, refreshToken, user }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.role) {
      localStorage.setItem(ROLE_KEY, user.role);
    }
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      let body = null;
      try {
        body = await response.json();
      } catch {
        // non-json response
      }

      if (!response.ok) {
        clearAuthStorage();
        const message =
          body && body.message ? body.message : `Request failed: ${response.status}`;
        const err = new Error(message);
        err.status = response.status;
        err.body = body;
        throw err;
      }

      const session = {
        accessToken: body?.data?.accessToken,
        refreshToken: body?.data?.refreshToken,
      };
      setAuthSession(session);
      return session.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function request(method, path, data, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(opts.headers || {}),
    },
  };
  if (!isFormData && init.headers["Content-Type"] == null) {
    init.headers["Content-Type"] = "application/json";
  }

  if (isFormData) {
    delete init.headers["Content-Type"];
    init.body = data;
  } else if (data != null) {
    init.body = JSON.stringify(data);
  }

  const res = await fetch(url, init);
  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-json response
  }

  if (
    res.status === 401 &&
    !opts.skipAuthRefresh &&
    !opts._retried &&
    !path.includes("/api/v1/auth/login") &&
    !path.includes("/api/v1/auth/refresh-token")
  ) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      return request(method, path, data, {
        ...opts,
        _retried: true,
      });
    }
  }

  if (!res.ok) {
    const message =
      body && body.message ? body.message : `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export async function post(path, data, opts) {
  return request("POST", path, data, opts);
}

export async function get(path, opts) {
  return request("GET", path, null, opts);
}

export async function patch(path, data, opts){
  return request('PATCH', path, data, opts);
}

export async function del(path, opts) {
  return request("DELETE", path, null, opts);
}

export default { post, get, patch, delete: del };
