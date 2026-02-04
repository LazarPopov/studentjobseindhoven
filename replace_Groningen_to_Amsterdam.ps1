# replace_Groningen_to_Amsterdam.ps1
# Replaces Groningen -> Amsterdam in:
# 1) file contents (text files only)
# 2) file names
# 3) folder names
# Skips: .git, node_modules, .next, dist, build, out
# Also skips: this script itself (whatever its filename is)

param(
    [string]$Root = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$from = "Groningen"
$to   = "Amsterdam"

$skipDirs = @(".git","node_modules",".next","dist","build","out")
$thisScriptPath = $PSCommandPath

function Should-SkipPath([string]$FullName) {
    foreach ($d in $skipDirs) {
        if ($FullName -like "*\$d\*" -or $FullName -like "*\$d") { return $true }
    }
    return $false
}

function Test-IsLikelyTextFile([string]$Path) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($Path)
        if ($bytes.Length -eq 0) { return $true }
        if ($bytes -contains 0) { return $false }

        $nonPrintable = 0
        foreach ($b in $bytes) {
            if (($b -lt 9) -or (($b -gt 13) -and ($b -lt 32))) { $nonPrintable++ }
        }
        return (($nonPrintable / [double]$bytes.Length) -lt 0.02)
    } catch { return $false }
}

Write-Host "Root: $Root"
Write-Host "Skipping script file: $([System.IO.Path]::GetFileName($thisScriptPath))"

$scannedFiles = 0
$changedFiles = 0
$renamedFiles = 0
$renamedDirs  = 0
$skippedRenamesBecauseTargetExists = 0

# 1) Replace inside file contents (FILES ONLY)
$files = Get-ChildItem -LiteralPath $Root -Recurse -File -Force
foreach ($f in $files) {
    if ($f.FullName -ieq $thisScriptPath) { continue }
    if (Should-SkipPath $f.FullName) { continue }

    $scannedFiles++

    if (-not (Test-IsLikelyTextFile $f.FullName)) { continue }

    $text = Get-Content -LiteralPath $f.FullName -Raw
    if ($text -notmatch $from) { continue }

    $newText = $text -replace $from, $to
    if ($newText -ne $text) {
        Set-Content -LiteralPath $f.FullName -Value $newText -NoNewline
        $changedFiles++
        Write-Host "Content updated: $($f.FullName)"
    }
}

# 2) Rename files (deepest first)
$filesToRename = Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
    Where-Object {
        $_.FullName -ine $thisScriptPath -and
        -not (Should-SkipPath $_.FullName) -and
        $_.Name -match $from
    } |
    Sort-Object FullName -Descending

foreach ($item in $filesToRename) {
    $newName = $item.Name -replace $from, $to
    $parent  = Split-Path -LiteralPath $item.FullName -Parent
    $target  = Join-Path -Path $parent -ChildPath $newName

    if (Test-Path -LiteralPath $target) {
        $skippedRenamesBecauseTargetExists++
        Write-Warning "Skip file rename, target exists: $($item.FullName) -> $target"
        continue
    }

    Rename-Item -LiteralPath $item.FullName -NewName $newName
    $renamedFiles++
    Write-Host "File renamed: $($item.FullName) -> $target"
}

# 3) Rename folders (deepest first)
$dirsToRename = Get-ChildItem -LiteralPath $Root -Recurse -Directory -Force |
    Where-Object {
        -not (Should-SkipPath $_.FullName) -and
        $_.Name -match $from
    } |
    Sort-Object FullName -Descending

foreach ($dir in $dirsToRename) {
    $newName = $dir.Name -replace $from, $to
    $parent  = Split-Path -LiteralPath $dir.FullName -Parent
    $target  = Join-Path -Path $parent -ChildPath $newName

    if (Test-Path -LiteralPath $target) {
        $skippedRenamesBecauseTargetExists++
        Write-Warning "Skip dir rename, target exists: $($dir.FullName) -> $target"
        continue
    }

    Rename-Item -LiteralPath $dir.FullName -NewName $newName
    $renamedDirs++
    Write-Host "Dir renamed: $($dir.FullName) -> $target"
}

Write-Host ""
Write-Host "Done."
Write-Host "Files scanned: $scannedFiles"
Write-Host "Files with content changed: $changedFiles"
Write-Host "Files renamed: $renamedFiles"
Write-Host "Folders renamed: $renamedDirs"
Write-Host "Renames skipped (target exists): $skippedRenamesBecauseTargetExists"
