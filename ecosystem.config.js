module.exports = {
  apps: [{
    name: "basic-express-server",
    script: "dist/index.js",
    instances: 3,
    exec_mode: "cluster",
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    watch: ["dist"],
    watch_delay: 1000,
    ignore_watch: ["node_modules", "client/img"],
    max_memory_restart: '300M',
    restart_delay: 2000,
    // autorestart: false,
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
