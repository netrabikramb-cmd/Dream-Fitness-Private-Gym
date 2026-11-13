param(
    [int]$Port = 8080
)

$baseDir = $PSScriptRoot
if (-not $baseDir) {
    $baseDir = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Write-Host "===================================================="
    Write-Host "Dreams Fitness Studio Local Preview Server"
    Write-Host "Live Preview URL: http://localhost:$Port"
    Write-Host "Serving files from: $baseDir"
    Write-Host "===================================================="
} catch {
    Write-Error "Failed to start listener on port $Port : $_"
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath).TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        # Replace forward slashes with platform path separators
        $relPath = $relPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $relPath))

        # Security check: must stay within base directory
        if (-not $fullPath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".webp" { "image/webp" }
                ".ico"  { "image/x-icon" }
                Default { "application/octet-stream" }
            }

            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache")

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.Close()
    } catch {
        # Keep listening even on error
    }
}
