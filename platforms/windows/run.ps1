$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding

./node.exe --enable-source-maps dist/index.js
pause
