/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "staging.atypicallyme.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "staging.atypicallyme.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "staging-atypical.s3.amazonaws.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    reactStrictMode: false
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
