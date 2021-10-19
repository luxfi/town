#!/usr/bin/env bash

test -z "$(docker ps -q 2>/dev/null)" && osascript -e 'quit app "Docker"'

open --background -a Docker