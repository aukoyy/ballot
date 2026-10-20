export const RouteMap = {
  home: {
    path: '/',
  },
  user: {
    login: '/login',
    register: '/register',
  },
  manage: {
    path: '/manage',
    edit: {
      path: '/edit/:pollId',
      createPath: (pollId: string) => `/edit/${pollId}`,
    },
  },
  conduct: {
    path: '/conduct/:pollId',
    createPath: (pollId: string) => `/conduct/${pollId}`,
  },
  vote: {
    path: '/vote/:pollId/voter/:voter',
    createPath: (pollId: string, voter: string) =>
      `/vote/${pollId}/voter/${voter}`,
  },
  results: {
    path: '/results/:pollId',
    createPath: (pollId: string) => `/results/${pollId}`,
  },
};
