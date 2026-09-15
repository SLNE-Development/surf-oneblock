package dev.slne.surf.oneblock.shared.module

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class OneBlockModuleDependencyTreeTest {
    @Test
    fun `sorts dependencies before their dependents`() {
        val users = TestModule(
            type = OneBlockModuleType.USERS,
        )

        val oneBlock = TestModule(
            type = OneBlockModuleType.ONEBLOCK,
            dependencies = listOf(OneBlockModuleType.USERS),
        )

        val tree = OneBlockModuleDependencyTree(
            modules = listOf(oneBlock, users),
        )

        assertEquals(
            expected = listOf(users, oneBlock),
            actual = tree.sortedAscending(),
        )

        assertEquals(
            expected = listOf(oneBlock, users),
            actual = tree.sortedDescending(),
        )
    }

    @Test
    fun `rejects missing dependencies`() {
        val exception = assertFailsWith<IllegalStateException> {
            OneBlockModuleDependencyTree(
                modules = listOf(
                    TestModule(
                        type = OneBlockModuleType.ONEBLOCK,
                        dependencies = listOf(OneBlockModuleType.USERS),
                    ),
                ),
            )
        }

        assertTrue(exception.message.orEmpty().contains("not registered"))
    }

    @Test
    fun `rejects dependency cycles`() {
        val exception = assertFailsWith<IllegalStateException> {
            OneBlockModuleDependencyTree(
                modules = listOf(
                    TestModule(
                        type = OneBlockModuleType.USERS,
                        dependencies = listOf(OneBlockModuleType.ONEBLOCK),
                    ),
                    TestModule(
                        type = OneBlockModuleType.ONEBLOCK,
                        dependencies = listOf(OneBlockModuleType.USERS),
                    ),
                ),
            )
        }

        assertTrue(
            exception.message.orEmpty().contains("Cyclic module dependency")
        )
    }

    @Test
    fun `rejects duplicate module types`() {
        val exception = assertFailsWith<IllegalStateException> {
            OneBlockModuleDependencyTree(
                modules = listOf(
                    TestModule(OneBlockModuleType.USERS),
                    TestModule(OneBlockModuleType.USERS),
                ),
            )
        }

        assertTrue(
            exception.message.orEmpty().contains("Duplicate")
        )
    }

    @Test
    fun `sorts independent modules deterministically`() {
        val users = TestModule(OneBlockModuleType.USERS)
        val oneBlock = TestModule(OneBlockModuleType.ONEBLOCK)

        val firstOrder = OneBlockModuleDependencyTree(
            modules = listOf(users, oneBlock),
        ).sortedAscending()

        val secondOrder = OneBlockModuleDependencyTree(
            modules = listOf(oneBlock, users),
        ).sortedAscending()

        assertEquals(
            expected = listOf(oneBlock, users),
            actual = firstOrder,
        )

        assertEquals(
            expected = firstOrder,
            actual = secondOrder,
        )
    }

    @Test
    fun `ignores missing soft dependencies`() {
        val oneBlock = TestModule(
            type = OneBlockModuleType.ONEBLOCK,
            softDependencies = listOf(OneBlockModuleType.USERS),
        )

        val tree = OneBlockModuleDependencyTree(
            modules = listOf(oneBlock),
        )

        assertEquals(
            expected = listOf(oneBlock),
            actual = tree.sortedAscending(),
        )
    }

    @Test
    fun `orders present soft dependencies before dependents`() {
        val oneBlock = TestModule(
            type = OneBlockModuleType.ONEBLOCK,
            softDependencies = listOf(OneBlockModuleType.USERS),
        )
        val users = TestModule(OneBlockModuleType.USERS)

        val tree = OneBlockModuleDependencyTree(
            modules = listOf(oneBlock, users),
        )

        assertEquals(
            expected = listOf(users, oneBlock),
            actual = tree.sortedAscending(),
        )
    }

    private data class TestModule(
        override val type: OneBlockModuleType,
        override val dependencies: List<OneBlockModuleType> = emptyList(),
        override val softDependencies: List<OneBlockModuleType> = emptyList(),
    ) : OneBlockModule
}