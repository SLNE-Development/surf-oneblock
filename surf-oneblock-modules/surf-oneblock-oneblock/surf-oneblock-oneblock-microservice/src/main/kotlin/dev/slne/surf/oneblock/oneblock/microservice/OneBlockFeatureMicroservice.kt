package dev.slne.surf.oneblock.oneblock.microservice

import dev.slne.surf.oneblock.oneblock.microservice.db.tables.OneBlocksTable
import dev.slne.surf.oneblock.microservice.api.OneBlockMicroservice
import dev.slne.surf.oneblock.shared.module.OneBlockModuleType
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.SchemaUtils
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.transactions.suspendTransaction

object OneBlockFeatureMicroservice : OneBlockMicroservice(
    type = OneBlockModuleType.ONEBLOCK,
    dependencies = listOf(OneBlockModuleType.USERS)
) {
    override suspend fun onBootstrap(args: List<String>) {
        suspendTransaction {
            SchemaUtils.create(
                OneBlocksTable,
            )
        }
    }

    override suspend fun onDisable() {

    }
}
