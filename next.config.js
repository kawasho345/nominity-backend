
const nextConfig = {
    reactStrictMode: true,
    async headers(){
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                      key: "Access-Control-Allow-Credetials",
                      value: "true",  
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "http://localhost:3000",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Origin, X-Requested-With, Content-Type, Authorization, Accept",
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig
