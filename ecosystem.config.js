module.exports = {
  apps: [
    {
      name: 'tennis-string-advisor',
      script: './node_modules/.bin/next',
      args: 'dev',
      cwd: '/home/user/webapp',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '5s',
      max_restarts: 5,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      log_file: '/home/user/webapp/logs/combined.log',
      out_file: '/home/user/webapp/logs/out.log',
      error_file: '/home/user/webapp/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
    },
  ],
};