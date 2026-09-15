package dev.slne.surf.oneblock.shared.module

class OneBlockModuleDependencyTree<T : OneBlockModule>(modules: List<T>) {

    private val byType = modules.associateBy { it.type }

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

        val inDegree = modules.associateWith { it.dependencies.size }.toMutableMap()
        val dependents = modules.associateWith { mutableListOf<T>() }
        for (module in modules) {
            for (dependency in module.dependencies) {
                dependents.getValue(byType.getValue(dependency)).add(module)
            }
        }

        val ready = ArrayDeque(modules.filter { inDegree.getValue(it) == 0 })
        val result = mutableListOf<T>()

        while (ready.isNotEmpty()) {
            val module = ready.removeFirst()
            result.add(module)

            for (dependent in dependents.getValue(module)) {
                val remaining = inDegree.getValue(dependent) - 1
                inDegree[dependent] = remaining
                if (remaining == 0) {
                    ready.addLast(dependent)
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