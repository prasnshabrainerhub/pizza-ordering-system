module.exports = {
    async redirects() {
      return [
        {
          source: '/home',
          destination: '/', // Redirect to the homepage
          permanent: false, // Temporary redirect
        },
      ];
    },
  };
  