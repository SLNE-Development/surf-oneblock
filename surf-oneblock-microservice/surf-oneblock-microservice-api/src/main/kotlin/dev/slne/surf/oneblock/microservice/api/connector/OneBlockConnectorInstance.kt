package dev.slne.surf.oneblock.microservice.api.connector

import dev.slne.surf.api.core.util.requiredService
import dev.slne.surf.database.DatabaseApi
import dev.slne.surf.rabbitmq.api.ServerRabbitMQApi

interface OneBlockConnectorInstance {
    val rabbitApi: ServerRabbitMQApi
    val databaseApi: DatabaseApi

    companion object : OneBlockConnectorInstance by instance {
        val INSTANCE get() = instance
    }
}

private val instance = requiredService<OneBlockConnectorInstance>()