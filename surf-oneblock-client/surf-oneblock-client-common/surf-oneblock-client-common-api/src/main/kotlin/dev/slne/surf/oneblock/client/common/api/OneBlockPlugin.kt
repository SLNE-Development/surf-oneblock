package dev.slne.surf.oneblock.client.common.api

import dev.slne.surf.oneblock.shared.module.OneBlockModule
import dev.slne.surf.oneblock.shared.module.OneBlockModuleType

abstract class OneBlockPlugin(
    override val type: OneBlockModuleType,
    override val dependencies: List<OneBlockModuleType> = emptyList()
) : OneBlockModule {
    abstract suspend fun onLoad()
    abstract suspend fun onEnable()
    abstract suspend fun onDisable()
}