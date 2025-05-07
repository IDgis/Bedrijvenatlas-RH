#!/bin/bash

if ls $1/*.json >/dev/null 2>&1; then
	echo copying funda json data from $1 to $2
	cp $1/*.json $2/.
else
	echo funda json data does not exist
fi
