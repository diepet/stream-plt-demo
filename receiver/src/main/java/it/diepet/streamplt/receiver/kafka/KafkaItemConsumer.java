package it.diepet.streamplt.receiver.kafka;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.eventbus.EventBus;

public class KafkaItemConsumer {

	private static final Logger LOGGER = LoggerFactory.getLogger(KafkaItemConsumer.class);
	private static final String TOPIC_NAME = "items";

	private KafkaConsumer<String, String> consumer = null;
	private EventBus eventBus;
	

	public KafkaItemConsumer(final EventBus eventBus) {
		super();
		this.eventBus = eventBus;
	}

	private void init() {
		Properties props = new Properties();
		props.put("bootstrap.servers", "localhost:29092");
		props.put("group.id", "receiver");
		props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
		props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
		consumer = new KafkaConsumer<String, String>(props);
		consumer.subscribe(Collections.singletonList(TOPIC_NAME));
	}

	public void start() {
		init();
		while (true) {
			ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(200));
			if (!records.isEmpty()) {
				LOGGER.debug("Received {} records to consume", records.count());
				//KafkaItemProducer.getInstance().send(records);
				for (final ConsumerRecord<String, String> record : records) {
					LOGGER.debug("Received Kafka item ({}): {}", record.key(), record.value());
					eventBus.send("items", record.value());
				}
				consumer.commitAsync();
			}
		}
	}
	
}
