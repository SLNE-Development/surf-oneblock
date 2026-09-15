package dev.slne.surf.oneblock.user.microservice

import dev.slne.surf.oneblock.microservice.api.OneBlockMicroservice
import dev.slne.surf.oneblock.shared.module.OneBlockModuleType

object UserMicroservice : OneBlockMicroservice(
    type = OneBlockModuleType.USERS,
) {
    override suspend fun onBootstrap(args: List<String>) {

    }

    override suspend fun onDisable() {

    }
}
