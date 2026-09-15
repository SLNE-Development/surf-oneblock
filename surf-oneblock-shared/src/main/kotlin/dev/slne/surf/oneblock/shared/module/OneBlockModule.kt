package dev.slne.surf.oneblock.shared.module

interface OneBlockModule {
    val type: OneBlockModuleType
    val dependencies: List<OneBlockModuleType>
}