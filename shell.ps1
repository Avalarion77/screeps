$destDir = "C:\Users\Avalarion\AppData\Local\Screeps\scripts\127_0_0_1___21025\default"
$sourceDir = "C:\Users\Avalarion\WebstormProjects\screeps\dist"
Remove-Item -path $destDir\* -include '*.js'
Copy-Item -path $sourceDir\*.js -Destination $destDir