#!/bin/sh
set -e
export JAVA_HOME=/opt/jdk1.8.0_181
export CONFLUENT_HOME=/opt/confluent-5.0.0
export LOCAL_KAFKA_HOME=/home/diepet/dev/confluent
export LOG_DIR=$LOCAL_KAFKA_HOME/log-kafka

cd $LOCAL_KAFKA_HOME
$CONFLUENT_HOME/bin/kafka-server-start $LOCAL_KAFKA_HOME/cfg-kafka.properties
