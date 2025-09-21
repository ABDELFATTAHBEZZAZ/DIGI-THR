@echo off
echo Building DocumentAnalyzer server...
set NODE_ENV=development

:: Compile TypeScript
node node_modules/typescript/bin/tsc --project tsconfig.json

if %ERRORLEVEL% NEQ 0 (
    echo Failed to compile TypeScript
    exit /b %ERRORLEVEL%
)

echo Starting server...
node dist/server/index.js
