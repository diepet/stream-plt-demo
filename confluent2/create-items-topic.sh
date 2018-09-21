#!/bin/bash
set -e
export CONFLUENT_HOME=/opt/confluent-5.0.0
$CONFLUENT_HOME/bin/kafka-topics --create --zookeeper localhost:22181 --replication-factor 1 --partitions 1 --topic items
