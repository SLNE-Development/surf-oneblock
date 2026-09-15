package dev.slne.surf.oneblock.oneblock.microservice.db.tables

import dev.slne.surf.database.columns.nativeUuid
import dev.slne.surf.database.columns.time.offsetDateTime
import dev.slne.surf.database.table.AuditableLongIdTable

object OneBlocksTable : AuditableLongIdTable("one_blocks") {
    val uuid = nativeUuid("uuid").uniqueIndex()
    val ownerUuid = nativeUuid("owner_uuid").uniqueIndex()

    val phaseId = varchar("phase_id", 255)
    val phaseProgress = long("phase_progress").default(0)
    val totalMined = long("total_mined").default(0)

    val islandUuid = nativeUuid("island_uuid").nullable()
    val slotId = varchar("slot_id", 128).nullable()
    val placedAt = offsetDateTime("placed_at").nullable()

    init {
        uniqueIndex(islandUuid, slotId)
    }
}
