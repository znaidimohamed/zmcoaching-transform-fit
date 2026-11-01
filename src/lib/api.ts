import axios from "axios";

export const api = axios.create({
  baseURL: "https://zmcoachingbackend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Expired / invalid token (JWT lasts 7 days): clear the stale session and go to login,
// instead of staying "logged in" with a dead token and seeing errors everywhere.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const hadToken = !!localStorage.getItem("token");
    const isAuthCall = url.includes("/auth/");

    if (status === 401 && hadToken && !isAuthCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Network error, timeout, or a gateway error (typical of a sleeping Render server)
const isRetryable = (err: unknown) => {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;

  return !err.response || status === 502 || status === 503 || status === 504;
};

// Wakes the backend up (Render free tier sleeps after inactivity).
export const warmUpBackend = () => {
  api.get("/", { timeout: 60000 }).catch(() => {
    /* ignore: only used to wake the server */
  });
};

export const sendCoachAiMessage = async (message: string) => {
  const attempt = () =>
    api.post("/ai/chat", { message }, { timeout: 60000 });

  try {
    const res = await attempt();
    return res.data;
  } catch (err) {
    if (!isRetryable(err)) throw err;

    // The server was probably still waking up: retry once.
    await sleep(3000);
    const res = await attempt();
    return res.data;
  }
};
