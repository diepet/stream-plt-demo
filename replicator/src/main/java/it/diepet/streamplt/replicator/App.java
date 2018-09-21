package it.diepet.streamplt.replicator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.diepet.streamplt.replicator.kafka.KafkaItemConsumer;

public class App {

	private static final Logger LOGGER = LoggerFactory.getLogger(App.class);
	
	public static void main(String[] args) {
		
		LOGGER.info("Replicator launch");
		KafkaItemConsumer.getInstance().start();
	}
}
