package dev.slne.surf.oneblock.microservice.shade.connector

import com.google.auto.service.AutoService
import dev.slne.surf.database.DatabaseApi
import dev.slne.surf.oneblock.microservice.api.connector.OneBlockConnectorInstance
import dev.slne.surf.oneblock.microservice.shade.microservice
import dev.slne.surf.rabbitmq.api.ServerRabbitMQApi

@AutoService(OneBlockConnectorInstance::class)
class OneBlockConnectorInstanceImpl : OneBlockConnectorInstance {
    override val rabbitApi: ServerRabbitMQApi
        get() = microservice.rabbitApi

    override val databaseApi: DatabaseApi
        get() = microservice.databaseApi
}