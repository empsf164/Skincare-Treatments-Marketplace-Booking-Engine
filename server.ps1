$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5510/")
$listener.Start()
Write-Host "LUMEA server active on http://localhost:5510/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ($localPath -eq '') { $localPath = 'index.html' }
        
        $fullPath = Join-Path $PSScriptRoot $localPath
        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            switch ($ext) {
                '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                '.css'  { $response.ContentType = 'text/css; charset=utf-8' }
                '.js'   { $response.ContentType = 'application/javascript; charset=utf-8' }
                '.json' { $response.ContentType = 'application/json' }
                '.png'  { $response.ContentType = 'image/png' }
                '.jpg'  { $response.ContentType = 'image/jpeg' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.svg'  { $response.ContentType = 'image/svg+xml' }
                default { $response.ContentType = 'text/plain' }
            }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $response.OutputStream.Close()
        }
    } catch {
        # continue loop
    }
}
