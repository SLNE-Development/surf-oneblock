package dev.slne.surf.oneblock.oneblock.api.slot

import java.util.UUID

data class OneBlockSlotRef(
    val islandUuid: UUID,
    val slotId: String,
) {
    init {
        require(slotId.isNotBlank()) { "A OneBlock slot ID must not be blank" }
    }
}
