#!/bin/bash
set -e
export SCRIPT_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $SCRIPT_FOLDER
mkfifo backpipe
nc -l 59092 0<backpipe | nc localhost 9092 1>backpipe