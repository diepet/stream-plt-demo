package it.diepet.streamplt.transmitter.kafka;

import java.util.Properties;
import java.util.UUID;

import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class KafkaItemProducer {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(KafkaItemProducer.class);

	private static final String TOPIC_NAME = "items";
	private static KafkaItemProducer instance = new KafkaItemProducer();
	private KafkaProducer<String, String> producer;

	public static final KafkaItemProducer getInstance() {
		return instance;
	}

	private KafkaItemProducer() {
		super();
		init();
	}

	public void init() {
		Properties props = new Properties();
		props.put("bootstrap.servers", "localhost:9092");
		props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

		producer = new KafkaProducer<>(props);
	}

	public void send(String item) {
		final String uuid = UUID.randomUUID().toString();
		ProducerRecord<String, String> record = new ProducerRecord<String, String>(TOPIC_NAME, uuid, item);
		producer.send(record, new Callback() {
			@Override
			public void onCompletion(RecordMetadata metadata, Exception exception) {
				if (exception == null) {
					LOGGER.debug("Sent to Kafka item having UUID: {}", uuid);
				} else {
					LOGGER.error("Some error occurred while trying to send item having UUID: " + uuid, exception);
				}
			}
		});
	}
}
