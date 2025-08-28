#!/bin/bash

# Tennis String Advisor - Start Development Server
echo "🎾 Starting Tennis String Advisor Development Server..."

# Navigate to project directory
cd /home/user/webapp

# Install any missing dependencies silently
echo "📦 Checking dependencies..."
npm install --silent > /dev/null 2>&1

# Create logs directory if it doesn't exist
mkdir -p logs

# Start Next.js development server
echo "🚀 Launching Next.js server on port 3000..."
nohup npm run dev > logs/server.log 2>&1 &

# Get the PID and save it
echo $! > logs/server.pid

echo "✅ Server started successfully!"
echo "📝 Logs: tail -f logs/server.log"
echo "🔢 PID: $(cat logs/server.pid)"
echo "🌐 Local: http://localhost:3000"

# Wait a moment and check if it's running
sleep 3
if ps -p $(cat logs/server.pid) > /dev/null 2>&1; then
    echo "🟢 Server is running (PID: $(cat logs/server.pid))"
else
    echo "🔴 Server failed to start - check logs/server.log"
fi