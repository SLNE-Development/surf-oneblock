package dev.slne.surf.oneblock.microservice.shade

import dev.slne.surf.oneblock.oneblock.microservice.OneBlockFeatureMicroservice
import dev.slne.surf.oneblock.microservice.api.OneBlockMicroservice
import dev.slne.surf.oneblock.shared.module.OneBlockModuleDependencyTree
import dev.slne.surf.oneblock.user.microservice.UserMicroservice

object OneBlockMicroserviceManager {
    private val dependencyTree = OneBlockModuleDependencyTree<OneBlockMicroservice>(buildList {
        add(UserMicroservice)
        add(OneBlockFeatureMicroservice)
    })

    suspend fun onBootstrap(args: List<String>) {
        for (microservice in dependencyTree.sortedAscending()) {
            microservice.onBootstrap(args)
        }
    }

    suspend fun onDisable() {
        for (microservice in dependencyTree.sortedDescending()) {
            microservice.onDisable()
        }
    }
}
