package dev.slne.surf.oneblock.user.api.utils

import dev.slne.surf.core.api.common.player.SurfPlayer
import dev.slne.surf.oneblock.user.api.OneBlockUser
import dev.slne.surf.oneblock.user.api.OneBlockUserManager

fun SurfPlayer.oneBlockUser(): OneBlockUser? = OneBlockUserManager.getUserByUuid(uuid)