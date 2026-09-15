package dev.slne.surf.oneblock.oneblock.client.paper

import dev.slne.surf.oneblock.client.common.api.OneBlockPlugin
import dev.slne.surf.oneblock.shared.module.OneBlockModuleType

object OneBlockFeaturePlugin : OneBlockPlugin(
    type = OneBlockModuleType.ONEBLOCK,
    dependencies = listOf(OneBlockModuleType.USERS)
) {
    override suspend fun onLoad() {

    }

    override suspend fun onEnable() {

    }

    override suspend fun onDisable() {

    }
}
