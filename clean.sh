./fixperms.sh
find . -maxdepth 2 -name bin -type d -print0|xargs -0 rm -r --
find . -maxdepth 2 -name obj -type d -print0|xargs -0 rm -r --

dotnet restore
dotnet clean