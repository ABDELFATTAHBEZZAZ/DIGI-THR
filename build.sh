#!/bin/bash

# Build script for Netlify deployment
echo "Building DIGI THR application for Netlify..."

# Build the frontend
echo "Building frontend..."
npm run build

# Create netlify functions directory
mkdir -p netlify/functions

# Copy server files to netlify functions
echo "Preparing serverless functions..."
cp -r server netlify/functions/

# Build success message
echo "Build completed successfully!"
echo "Frontend built to: client/dist"
echo "Server functions prepared in: netlify/functions"