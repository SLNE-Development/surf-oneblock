package dev.slne.surf.oneblock.client.velocity.shade

import com.github.shynixn.mccoroutine.velocity.SuspendingPluginContainer
import com.google.inject.Inject
import com.velocitypowered.api.event.Subscribe
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent
import com.velocitypowered.api.event.proxy.ProxyShutdownEvent
import com.velocitypowered.api.plugin.PluginContainer
import com.velocitypowered.api.plugin.annotation.DataDirectory
import com.velocitypowered.api.proxy.ProxyServer
import dev.slne.surf.oneblock.client.common.shade.OneBlockPluginManager
import kotlinx.coroutines.runBlocking
import java.nio.file.Path

class VelocityMain @Inject constructor(
    val proxy: ProxyServer,
    @DataDirectory val pluginPath: Path,
    val container: PluginContainer,
    suspendingContainer: SuspendingPluginContainer
) {
    init {
        INSTANCE = this
        suspendingContainer.initialize(this)

        runBlocking {
            OneBlockPluginManager.INSTANCE.onLoad()
        }
    }

    @Subscribe
    suspend fun onInit(event: ProxyInitializeEvent) {
        OneBlockPluginManager.INSTANCE.onEnable()
    }

    @Subscribe
    suspend fun onShutdown(event: ProxyShutdownEvent) {
        OneBlockPluginManager.INSTANCE.onDisable()
    }

    companion object {
        lateinit var INSTANCE: VelocityMain
            private set
    }
}

val plugin get() = VelocityMain.INSTANCE
val container get() = plugin.container
val proxy get() = plugin.proxy