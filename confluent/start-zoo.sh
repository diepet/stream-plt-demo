#!/bin/sh
set -e
export JAVA_HOME=/opt/jdk1.8.0_181
export CONFLUENT_HOME=/opt/confluent-5.0.0
export LOCAL_ZOO_HOME=/home/diepet/dev/confluent
export LOG_DIR=$LOCAL_ZOO_HOME/log-zoo

cd $LOCAL_ZOO_HOME
$CONFLUENT_HOME/bin/zookeeper-server-start $LOCAL_ZOO_HOME/cfg-zoo.properties