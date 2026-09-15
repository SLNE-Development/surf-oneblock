package dev.slne.surf.oneblock.user.api

import dev.slne.surf.api.core.util.requiredService
import it.unimi.dsi.fastutil.objects.ObjectSet
import org.jetbrains.annotations.Unmodifiable
import java.util.*

interface OneBlockUserManager {
    val cachedUsers: @Unmodifiable ObjectSet<OneBlockUser>

    fun getUserByUuid(uuid: UUID): OneBlockUser?

    companion object : OneBlockUserManager by manager {
        val INSTANCE get() = manager
    }
}

private val manager = requiredService<OneBlockUserManager>()