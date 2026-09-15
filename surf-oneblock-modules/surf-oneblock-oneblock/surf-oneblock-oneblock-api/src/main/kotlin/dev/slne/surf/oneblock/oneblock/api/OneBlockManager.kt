package dev.slne.surf.oneblock.oneblock.api

import dev.slne.surf.api.core.util.requiredService
import it.unimi.dsi.fastutil.objects.ObjectSet
import org.jetbrains.annotations.Unmodifiable
import java.util.*

interface OneBlockManager {
    val oneBlocks: @Unmodifiable ObjectSet<OneBlock>

    fun getOneBlockByUuid(uuid: UUID): OneBlock?
    fun getOneBlockByOwnerUuid(ownerUuid: UUID): OneBlock?

    companion object : OneBlockManager by manager {
        val INSTANCE get() = manager
    }
}

private val manager = requiredService<OneBlockManager>()
