package dev.slne.surf.oneblock.user.api

import dev.slne.surf.core.api.common.player.SurfPlayer
import java.util.*

interface OneBlockUser {
    val uuid: UUID

    val surfPlayer: SurfPlayer

    companion object {
        operator fun get(uuid: UUID) = OneBlockUserManager.getUserByUuid(uuid)
    }
}