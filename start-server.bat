@echo off
echo ========================================
echo   DIGI THR - Serveur HTTP Simple
echo ========================================
echo.

REM Vérifier que le répertoire dist/public existe
if not exist "dist\public" (
    echo Erreur: Le répertoire dist\public n'existe pas!
    echo Veuillez d'abord construire le projet avec: npm run build
    pause
    exit /b 1
)

echo Démarrage du serveur HTTP sur le port 8080...
echo Répertoire racine: dist\public
echo URL: http://localhost:8080
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

REM Utiliser PowerShell pour créer un serveur HTTP simple
powershell -ExecutionPolicy Bypass -Command "& {
    $port = 8080
    $rootPath = 'dist\public'
    
    # Créer un serveur HTTP simple
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add('http://localhost:' + $port + '/')
    
    try {
        $listener.Start()
        Write-Host '✅ Serveur démarré avec succès!' -ForegroundColor Green
        Write-Host '🌐 Ouvrez votre navigateur sur: http://localhost:' + $port -ForegroundColor Cyan
        Write-Host ''
        
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Définir les en-têtes CORS
            $response.Headers.Add('Access-Control-Allow-Origin', '*')
            $response.Headers.Add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            $response.Headers.Add('Access-Control-Allow-Headers', 'Content-Type')
            
            # Gérer les requêtes OPTIONS
            if ($request.HttpMethod -eq 'OPTIONS') {
                $response.StatusCode = 200
                $response.Close()
                continue
            }
            
            # Déterminer le chemin du fichier
            $localPath = $request.Url.LocalPath
            if ($localPath -eq '/' -or $localPath -eq '/login' -or $localPath -eq '/admin' -or $localPath -eq '/production' -or $localPath -eq '/maintenance' -or $localPath -eq '/security' -or $localPath -eq '/dashboard') {
                $filePath = Join-Path $rootPath 'index.html'
            } else {
                $filePath = Join-Path $rootPath $localPath.TrimStart('/')
            }
            
            # Vérifier si le fichier existe
            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    '.html' { 'text/html; charset=utf-8' }
                    '.js' { 'application/javascript' }
                    '.css' { 'text/css' }
                    '.png' { 'image/png' }
                    '.jpg' { 'image/jpeg' }
                    '.jpeg' { 'image/jpeg' }
                    '.svg' { 'image/svg+xml' }
                    '.ico' { 'image/x-icon' }
                    default { 'text/plain' }
                }
                
                $response.ContentType = $contentType
                $response.StatusCode = 200
                
                # Lire et envoyer le fichier
                $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $fileBytes.Length
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            } else {
                # Fallback vers index.html pour SPA routing
                $filePath = Join-Path $rootPath 'index.html'
                if (Test-Path $filePath) {
                    $response.ContentType = 'text/html; charset=utf-8'
                    $response.StatusCode = 200
                    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                    $response.ContentLength64 = $fileBytes.Length
                    $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                } else {
                    $response.StatusCode = 404
                    $response.ContentType = 'text/html; charset=utf-8'
                    $errorHtml = '<h1>404 - Page non trouvée</h1><p>Le fichier demandé n''existe pas.</p>'
                    $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
                    $response.ContentLength64 = $errorBytes.Length
                    $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
                }
            }
            
            $response.Close()
        }
    } catch {
        Write-Host 'Erreur lors du démarrage du serveur: ' + $_.Exception.Message -ForegroundColor Red
    } finally {
        $listener.Stop()
        Write-Host 'Serveur arrêté.' -ForegroundColor Yellow
    }
}"

pause