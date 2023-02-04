@echo off
if "%1" == "" ( goto warning )
echo Please make sure you have:
echo (1) Edited version information in src/App.vue.
echo (2) Edited version of package.json.
echo (3) made pnpm-lock.yaml up-to-date.
echo (4) made README.md coverage ^& other information up-to-date.
echo (5) printed README.md to public/README.html.
echo (6) printed CHANGELOG.md to public/CHANGELOG.html.
set /p ready="Ready? (y/N) "
if not "%ready%" == "y" ( goto end )
git add .
git commit -m "Release: %1"
git tag %1
call pnpm build
call netlify deploy --prod -d dist --message %1
git push origin main && echo Push successfully!
goto end

:warning
echo build\release.bat version(with 'v')
goto end

:end
