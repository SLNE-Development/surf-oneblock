package dev.slne.surf.oneblock.oneblock.microservice.db.repositories

import dev.slne.surf.oneblock.oneblock.api.OneBlock
import dev.slne.surf.oneblock.oneblock.api.phase.OneBlockPhaseId
import dev.slne.surf.oneblock.oneblock.api.slot.OneBlockSlotRef
import dev.slne.surf.oneblock.oneblock.core.common.OneBlockImpl
import dev.slne.surf.oneblock.oneblock.microservice.db.tables.OneBlocksTable
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.core.ResultRow
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.core.eq
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.insertReturning
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.selectAll
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.transactions.suspendTransaction
import dev.slne.surf.database.libs.org.jetbrains.exposed.v1.r2dbc.update
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.flow.single
import java.time.OffsetDateTime
import java.util.UUID

object OneBlocksRepository {
    suspend fun createOneBlock(
        ownerUuid: UUID,
        phaseId: OneBlockPhaseId,
        slotRef: OneBlockSlotRef? = null,
        placedAt: OffsetDateTime? = null,
    ): OneBlock = suspendTransaction {
        val row = OneBlocksTable.insertReturning {
            it[uuid] = UUID.randomUUID()
            it[OneBlocksTable.ownerUuid] = ownerUuid
            it[OneBlocksTable.phaseId] = phaseId.value
            it[phaseProgress] = 0
            it[totalMined] = 0
            it[islandUuid] = slotRef?.islandUuid
            it[slotId] = slotRef?.slotId
            it[OneBlocksTable.placedAt] = placedAt
        }.single()

        toOneBlock(row)
    }

    suspend fun findOneBlockByUuid(uuid: UUID): OneBlock? = suspendTransaction {
        OneBlocksTable
            .selectAll()
            .where { OneBlocksTable.uuid eq uuid }
            .toList()
            .singleOrNull()
            ?.let(::toOneBlock)
    }

    suspend fun findOneBlockByOwnerUuid(ownerUuid: UUID): OneBlock? = suspendTransaction {
        OneBlocksTable
            .selectAll()
            .where { OneBlocksTable.ownerUuid eq ownerUuid }
            .toList()
            .singleOrNull()
            ?.let(::toOneBlock)
    }

    suspend fun fetchOneBlocks(): List<OneBlock> = suspendTransaction {
        OneBlocksTable
            .selectAll()
            .toList()
            .map(::toOneBlock)
    }

    suspend fun updateProgress(
        oneBlockUuid: UUID,
        phaseId: OneBlockPhaseId,
        phaseProgress: Long,
        totalMined: Long,
    ): Boolean = suspendTransaction {
        OneBlocksTable.update({
            OneBlocksTable.uuid eq oneBlockUuid
        }) {
            it[OneBlocksTable.phaseId] = phaseId.value
            it[OneBlocksTable.phaseProgress] = phaseProgress
            it[OneBlocksTable.totalMined] = totalMined
        } > 0
    }

    suspend fun updatePlacement(
        oneBlockUuid: UUID,
        slotRef: OneBlockSlotRef?,
        placedAt: OffsetDateTime?,
    ): Boolean = suspendTransaction {
        OneBlocksTable.update({
            OneBlocksTable.uuid eq oneBlockUuid
        }) {
            it[islandUuid] = slotRef?.islandUuid
            it[slotId] = slotRef?.slotId
            it[OneBlocksTable.placedAt] = placedAt
        } > 0
    }

    private fun toOneBlock(row: ResultRow): OneBlock {
        val islandUuid = row[OneBlocksTable.islandUuid]
        val slotId = row[OneBlocksTable.slotId]
        val slotRef = when {
            islandUuid == null && slotId == null -> null
            islandUuid != null && slotId != null -> OneBlockSlotRef(islandUuid, slotId)
            else -> error("OneBlock ${row[OneBlocksTable.uuid]} has an incomplete slot reference")
        }

        return OneBlockImpl(
            uuid = row[OneBlocksTable.uuid],
            ownerUuid = row[OneBlocksTable.ownerUuid],
            createdAt = row[OneBlocksTable.createdAt],
            lastModifiedAt = row[OneBlocksTable.updatedAt],
            phaseId = OneBlockPhaseId(row[OneBlocksTable.phaseId]),
            phaseProgress = row[OneBlocksTable.phaseProgress],
            totalMined = row[OneBlocksTable.totalMined],
            slotRef = slotRef,
            placedAt = row[OneBlocksTable.placedAt],
        )
    }
}
