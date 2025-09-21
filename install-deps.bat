@echo off
echo Installing dependencies...
npm install better-sqlite3@9.4.0
npm install @types/better-sqlite3@7.6.8
npm install drizzle-orm@0.39.1
echo Dependencies installed successfully!
echo.
echo Running database migration...
npm run db:migrate
echo.
echo Setup complete! You can now run: npm run dev
pause
