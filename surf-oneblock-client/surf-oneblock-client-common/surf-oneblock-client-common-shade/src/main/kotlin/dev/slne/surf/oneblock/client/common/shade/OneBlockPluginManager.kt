package dev.slne.surf.oneblock.client.common.shade

import dev.slne.surf.api.core.util.requiredService
import dev.slne.surf.oneblock.client.common.api.OneBlockPlugin
import dev.slne.surf.oneblock.shared.module.OneBlockModuleDependencyTree

abstract class OneBlockPluginManager {
    private val dependencyTree = OneBlockModuleDependencyTree<OneBlockPlugin>(buildPluginList())

    abstract fun buildPluginList(): List<OneBlockPlugin>

    suspend fun onLoad() {
        for (plugin in dependencyTree.sortedAscending()) {
            plugin.onLoad()
        }
    }

    suspend fun onEnable() {
        for (plugin in dependencyTree.sortedAscending()) {
            plugin.onEnable()
        }
    }

    suspend fun onDisable() {
        for (plugin in dependencyTree.sortedDescending()) {
            plugin.onDisable()
        }
    }

    companion object {
        val INSTANCE = requiredService<OneBlockPluginManager>()
    }
}