start C:\"Program Files"\Docker\Docker\"Docker Desktop.exe"

code "C:\Projects\react\metronic-backend" | exit

code "C:\Projects\react\metronic" | exit

timeout /t 12 /nobreak

start cmd.exe /k "cd C:\Projects\react\metronic-backend & docker compose -f .\docker-compose.yml up -d"

exit