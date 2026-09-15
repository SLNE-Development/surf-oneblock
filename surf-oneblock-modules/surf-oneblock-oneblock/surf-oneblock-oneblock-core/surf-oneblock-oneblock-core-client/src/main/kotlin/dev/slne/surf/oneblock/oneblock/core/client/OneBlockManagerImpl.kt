package dev.slne.surf.oneblock.oneblock.core.client

import com.google.auto.service.AutoService
import dev.slne.surf.api.core.util.freeze
import dev.slne.surf.api.core.util.mutableObjectSetOf
import dev.slne.surf.oneblock.oneblock.api.OneBlock
import dev.slne.surf.oneblock.oneblock.api.OneBlockManager
import java.util.*

@AutoService(OneBlockManager::class)
class OneBlockManagerImpl : OneBlockManager {
    private val _oneBlocks = mutableObjectSetOf<OneBlock>()
    override val oneBlocks get() = _oneBlocks.freeze()

    override fun getOneBlockByUuid(uuid: UUID): OneBlock? =
        _oneBlocks.firstOrNull { it.uuid == uuid }

    override fun getOneBlockByOwnerUuid(ownerUuid: UUID): OneBlock? =
        _oneBlocks.firstOrNull { it.ownerUuid == ownerUuid }
}
