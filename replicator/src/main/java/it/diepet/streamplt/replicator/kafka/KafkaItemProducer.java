package it.diepet.streamplt.replicator.kafka;

import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.KafkaException;
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
		props.put("bootstrap.servers", "localhost:29092");
		props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
		props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "replicator01");

		producer = new KafkaProducer<>(props);
		producer.initTransactions();
	}

	public void send(ConsumerRecords<String, String> records) {
		
		try {
			producer.beginTransaction();
			for (final ConsumerRecord<String, String> record : records) {
				final ProducerRecord<String, String> producerRecord = new ProducerRecord<String, String>(TOPIC_NAME, record.key(), record.value());
				producer.send(producerRecord, new Callback() {
					@Override
					public void onCompletion(RecordMetadata metadata, Exception exception) {
						if (exception == null) {
							LOGGER.debug("Sent to Kafka item ({}): {}", producerRecord.key(), producerRecord.value());
						} else {
							LOGGER.error("Some error occurred while trying to send item: " + producerRecord.value(), exception);
						}
					}
				});
			}
			producer.commitTransaction();
		} catch (KafkaException e) {
			producer.abortTransaction();
		}
	}
}
