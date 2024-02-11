#!/bin/bash
# Copyright (c) 2024 Sierra Burkhart
# License: GNU General Public License version 3 (GPLv3)
# See full license text in file "LICENSE" at root of project directory

if [ -z "$1" ]; then
	echo "No region abbreviation found -- please try again (i.e., nv, nm, ca)"
else
	SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
	cd "$SCRIPT_DIR"
	unlink ./app.json
	ln -s ./app-"$1".json ./app.json
	cd ./assets
	unlink ./current
	ln -s "$1" ./current
	cd ..
	rm app-region.js
	echo "export const selectedRegion = '$1';" > app-region.js
	rm .easignore
	cp .gitignore .easignore
	printf '!assets/%s/photos_compressed/\n!assets/%s/markers.json' $1 $1 >> .easignore
fi