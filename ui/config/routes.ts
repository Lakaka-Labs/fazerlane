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
      home: "/u/home",
    },
  },
};

export default appRoutes;
