package dev.slne.surf.oneblock.client.paper.shade

import com.github.shynixn.mccoroutine.folia.SuspendingJavaPlugin
import dev.slne.surf.oneblock.client.common.shade.OneBlockPluginManager
import org.bukkit.plugin.java.JavaPlugin

class PaperMain : SuspendingJavaPlugin() {
    override suspend fun onLoadAsync() {
        OneBlockPluginManager.INSTANCE.onLoad()
    }

    override suspend fun onEnableAsync() {
        OneBlockPluginManager.INSTANCE.onEnable()
    }

    override suspend fun onDisableAsync() {
        OneBlockPluginManager.INSTANCE.onDisable()
    }
}

val plugin get() = JavaPlugin.getPlugin(PaperMain::class.java)