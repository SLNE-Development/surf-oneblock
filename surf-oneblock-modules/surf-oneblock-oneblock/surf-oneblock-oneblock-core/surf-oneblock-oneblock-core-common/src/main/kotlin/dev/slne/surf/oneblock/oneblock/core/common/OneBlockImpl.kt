package dev.slne.surf.oneblock.oneblock.core.common

import dev.slne.surf.oneblock.oneblock.api.OneBlock
import dev.slne.surf.oneblock.oneblock.api.phase.OneBlockPhaseId
import dev.slne.surf.oneblock.oneblock.api.slot.OneBlockSlotRef
import java.time.OffsetDateTime
import java.util.*

class OneBlockImpl(
    override val uuid: UUID,
    override val ownerUuid: UUID,
    override val createdAt: OffsetDateTime,
    lastModifiedAt: OffsetDateTime,
    phaseId: OneBlockPhaseId,
    phaseProgress: Long,
    totalMined: Long,
    slotRef: OneBlockSlotRef?,
    placedAt: OffsetDateTime?,
) : OneBlock {
    override var lastModifiedAt = lastModifiedAt
        private set

    override var phaseId = phaseId
        private set

    override var phaseProgress = phaseProgress
        private set

    override var totalMined = totalMined
        private set

    override var slotRef = slotRef
        private set

    override var placedAt = placedAt
        private set
}
