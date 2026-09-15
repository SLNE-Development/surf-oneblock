package dev.slne.surf.oneblock.client.paper.shade

import com.google.auto.service.AutoService
import dev.slne.surf.oneblock.oneblock.client.paper.OneBlockFeaturePlugin
import dev.slne.surf.oneblock.client.common.api.OneBlockPlugin
import dev.slne.surf.oneblock.client.common.shade.OneBlockPluginManager
import dev.slne.surf.oneblock.user.client.paper.UserOneBlockPlugin

@AutoService(OneBlockPluginManager::class)
class PaperOneBlockPluginManager : OneBlockPluginManager() {
    override fun buildPluginList(): List<OneBlockPlugin> = buildList {
        add(UserOneBlockPlugin)
        add(OneBlockFeaturePlugin)
    }
}
