package dev.slne.surf.oneblock.oneblock.api.phase

@JvmInline
value class OneBlockPhaseId(val value: String) {
    init {
        require(value.isNotBlank()) { "A OneBlock phase ID must not be blank" }
    }
}
