package it.diepet.streamplt.receiver.verticle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;

public class ReceiverVerticle extends AbstractVerticle {

	private static final Logger LOGGER = LoggerFactory.getLogger(ReceiverVerticle.class);
	
	@Override
	public void start(Future<Void> fut) {
		HttpServer server = vertx.createHttpServer();
		Router router = Router.router(vertx);
		router.route().handler(BodyHandler.create());
		router.route("/static/*").handler(StaticHandler.create().setWebRoot("webcontent"));
		server.requestHandler(router::accept).listen(8081);
	}
	
}
