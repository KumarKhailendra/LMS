module.exports = {
    apps: [
      {
        name: 'server',
        script: 'server.ts',
        exec_mode: 'fork',
        watch: true,
        autorestart: true,
        max_restarts: 10,
        interpreter: 'npx',                 // Use npx for Windows compatibility
        interpreter_args: 'ts-node-dev',        // Execute ts-node via npx
      },
    ],
  };
  