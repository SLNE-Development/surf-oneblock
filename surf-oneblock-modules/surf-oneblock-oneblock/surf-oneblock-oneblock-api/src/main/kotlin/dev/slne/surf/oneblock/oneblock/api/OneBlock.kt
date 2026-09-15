package dev.slne.surf.oneblock.oneblock.api

import dev.slne.surf.oneblock.oneblock.api.phase.OneBlockPhaseId
import dev.slne.surf.oneblock.oneblock.api.slot.OneBlockSlotRef
import java.time.OffsetDateTime
import java.util.*

interface OneBlock {
    val uuid: UUID
    val ownerUuid: UUID
    val createdAt: OffsetDateTime
    val lastModifiedAt: OffsetDateTime
    val phaseId: OneBlockPhaseId
    val phaseProgress: Long
    val totalMined: Long
    val slotRef: OneBlockSlotRef?
    val placedAt: OffsetDateTime?

    companion object {
        operator fun get(uuid: UUID) = OneBlockManager.getOneBlockByUuid(uuid)
    }
}
