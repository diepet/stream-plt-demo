package it.diepet.streamplt.transmitter.verticle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;
import it.diepet.streamplt.transmitter.kafka.KafkaItemProducer;

public class TransmitterVerticle extends AbstractVerticle {

	private static final Logger LOGGER = LoggerFactory.getLogger(TransmitterVerticle.class);

	@Override
	public void start(Future<Void> fut) {
		HttpServer server = vertx.createHttpServer();
		Router router = Router.router(vertx);
		router.route().handler(BodyHandler.create());
		Route route = router.route().path("/api/item");
		route.handler(routingContext -> {
			String item = routingContext.getBodyAsString();
			LOGGER.debug("Received from web UI " + item);
			KafkaItemProducer.getInstance().send(item);
			// This handler will be called for every request
			HttpServerResponse response = routingContext.response();
			response.putHeader("content-type", "text/plain");

			// Write to the response and end it
			response.end("OK");
		});
		router.route("/static/*").handler(StaticHandler.create().  setWebRoot("webcontent"));
		server.requestHandler(router::accept).listen(8080);
	}

}
