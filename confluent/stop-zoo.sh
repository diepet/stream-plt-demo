#!/bin/sh
set -e
export CONFLUENT_HOME=/opt/confluent-5.0.0
$CONFLUENT_HOME/bin/zookeeper-server-stop
