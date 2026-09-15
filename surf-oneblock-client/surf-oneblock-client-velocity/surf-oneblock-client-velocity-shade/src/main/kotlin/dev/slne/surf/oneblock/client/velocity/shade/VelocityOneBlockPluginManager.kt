package dev.slne.surf.oneblock.client.velocity.shade

import com.google.auto.service.AutoService
import dev.slne.surf.oneblock.client.common.api.OneBlockPlugin
import dev.slne.surf.oneblock.client.common.shade.OneBlockPluginManager

@AutoService(OneBlockPluginManager::class)
class VelocityOneBlockPluginManager : OneBlockPluginManager() {
    override fun buildPluginList(): List<OneBlockPlugin> = buildList {
        
    }
}