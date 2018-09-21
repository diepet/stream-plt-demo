#!/bin/bash
set -e
export JAVA_HOME=/opt/jdk1.8.0_181
export CONFLUENT_HOME=/opt/confluent-5.0.0
export LOCAL_ZOO_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
export LOG_DIR=./log-zoo


cd $LOCAL_ZOO_HOME
$CONFLUENT_HOME/bin/zookeeper-server-start cfg-zoo.properties