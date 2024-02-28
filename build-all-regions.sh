#!/bin/bash
# Copyright (c) 2024 Sierra Burkhart
# License: GNU General Public License version 3 (GPLv3)
# See full license text in file "LICENSE" at root of project directory

if [ -z "$1" ]; then
	echo "No build profile selected.  Options: production, preview, development"
else
	declare -a arr=("az" "ca" "co" "mt" "nm" "nv")
	for i in "${arr[@]}"
	do
		./select-region.sh "$i"
		eas build --profile "$1" --platform ios --local --clear-cache --non-interactive
		mv build*.ipa dist/"$i".ipa
	done
fi