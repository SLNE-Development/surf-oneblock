package dev.slne.surf.oneblock.microservice.api

import dev.slne.surf.oneblock.shared.module.OneBlockModule
import dev.slne.surf.oneblock.shared.module.OneBlockModuleType

abstract class OneBlockMicroservice(
    override val type: OneBlockModuleType,
    override val dependencies: List<OneBlockModuleType> = emptyList()
) : OneBlockModule {
    val name get() = type.name

    abstract suspend fun onBootstrap(args: List<String>)
    abstract suspend fun onDisable()
}