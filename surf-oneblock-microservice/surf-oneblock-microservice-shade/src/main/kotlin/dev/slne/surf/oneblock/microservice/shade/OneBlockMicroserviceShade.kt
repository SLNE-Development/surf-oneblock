package dev.slne.surf.oneblock.microservice.shade

import com.google.auto.service.AutoService
import dev.slne.surf.database.DatabaseApi
import dev.slne.surf.microservice.api.microservice.Microservice
import dev.slne.surf.microservice.api.microservice.getMicroservice
import dev.slne.surf.rabbitmq.api.ServerRabbitMQApi
import java.nio.file.Path
import kotlin.io.path.Path

@AutoService(Microservice::class)
class OneBlockMicroserviceShade : Microservice() {
    override val dataPath: Path = Path("config")

    val rabbitApi = ServerRabbitMQApi.create("surf-oneblock", dataPath)
    val databaseApi = DatabaseApi.create(dataPath)

    override suspend fun onBootstrap(args: List<String>) {
        OneBlockMicroserviceManager.onBootstrap(args)

        rabbitApi.freezeAndConnect()
    }

    override suspend fun onDisable() {
        OneBlockMicroserviceManager.onDisable()

        rabbitApi.disconnect()
        databaseApi.shutdown()
    }
}

val microservice get() = getMicroservice<OneBlockMicroserviceShade>()