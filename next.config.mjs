/** @type {import('next').NextConfig} */
const nextConfig = {

    compiler: {
        styledComponents: {
            displayName: true,
            ssr: true,

        },
    },

    webpack: (config, { isServer }) => {
        // Add SVGR loader
        config.module.rules.push({
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: { removeViewBox: false },
                    },
                  },
                ],
              },
              titleProp: true,
            },
            test: /\.svg$/,
          });
      
          return config;
    },
};

export default nextConfig;
