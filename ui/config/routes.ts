const appRoutes = {
  home: {
    index: "/",
  },
  auth: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    verify: "/auth/verify",
    reset: "/auth/reset",
  },
  dashboard: {
    user: {
      lanes: "/u/lanes",
      challanges: (laneId: string) => `/u/challanges/${laneId}`,
    },
  },
};

export default appRoutes;

export const API_BARE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const API_BASE_URL = API_BARE_URL ? `${API_BARE_URL}/api/v1` : "";

export const queryStateParams = {
  empty: "",
  error: "error",
  challengeId: "challenge-id",
  tab: "tab",
};
