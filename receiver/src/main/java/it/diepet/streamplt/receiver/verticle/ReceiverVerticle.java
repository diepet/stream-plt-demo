package it.diepet.streamplt.receiver.verticle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import it.diepet.streamplt.receiver.kafka.KafkaItemConsumer;

public class ReceiverVerticle extends AbstractVerticle {

	private static final Logger LOGGER = LoggerFactory.getLogger(ReceiverVerticle.class);

	@Override
	public void start(Future<Void> fut) {
		HttpServer server = vertx.createHttpServer();
		Router router = Router.router(vertx);
		// static content configuration
		router.route().handler(BodyHandler.create());
		router.route("/static/*").handler(StaticHandler.create().setWebRoot("webcontent"));

		// client event bus configuration
		SockJSHandler sockJSHandler = SockJSHandler.create(vertx);
		PermittedOptions outbound = new PermittedOptions().setAddress("items");
		BridgeOptions options = new BridgeOptions().addOutboundPermitted(outbound);
		sockJSHandler.bridge(options);

		router.route("/eventbus/*").handler(sockJSHandler);
		server.requestHandler(router::accept).listen(8081);
		LOGGER.info("Receiver server listening on port 8081");

		Runnable r = () -> {
			KafkaItemConsumer consumer = new KafkaItemConsumer(vertx.eventBus());
			consumer.start();
		};
		new Thread(r).start();
	}

}
