package dev.slne.surf.oneblock.shared.module

import java.util.PriorityQueue

class OneBlockModuleDependencyTree<T : OneBlockModule>(modules: List<T>) {

    private val byType = modules.associateBy { it.type }

    init {
        val duplicateTypes =
            modules.groupingBy { it.type }.eachCount().filterValues { count -> count > 1 }.keys.sortedBy { it.name }

        if (duplicateTypes.isNotEmpty()) {
            throw IllegalStateException(
                "Duplicate modules registered for: $duplicateTypes"
            )
        }
    }

    private val ascending: List<T> = run {
        for (module in modules) {
            for (dependency in module.dependencies) {
                if (dependency !in byType) {
                    throw IllegalStateException(
                        "Module '${module.type}' depends on '$dependency', which is not registered"
                    )
                }
            }
        }

        val resolvedDependencies = modules.associateWith { module ->
            (module.dependencies + module.softDependencies.filter { dependency -> dependency in byType }).distinct()
        }

        val inDegree = resolvedDependencies.mapValues { (_, dependencies) -> dependencies.size }.toMutableMap()

        val dependents = modules.associateWith { mutableListOf<T>() }

        for (module in modules) {
            for (dependency in resolvedDependencies.getValue(module)) {
                dependents.getValue(byType.getValue(dependency)).add(module)
            }
        }

        val ready = PriorityQueue(compareBy<T> { module -> module.type.name })
        ready.addAll(modules.filter { module -> inDegree.getValue(module) == 0 })
        val result = mutableListOf<T>()

        while (ready.isNotEmpty()) {
            val module = ready.remove()
            result.add(module)

            for (dependent in dependents.getValue(module)) {
                val remaining = inDegree.getValue(dependent) - 1
                inDegree[dependent] = remaining
                if (remaining == 0) {
                    ready.add(dependent)
                }
            }
        }

        if (result.size != modules.size) {
            val cyclic = modules.filter { it !in result }.map { it.type }
            throw IllegalStateException("Cyclic module dependency detected among: $cyclic")
        }

        result
    }

    fun sortedAscending(): List<T> = ascending

    fun sortedDescending(): List<T> = ascending.asReversed()
}