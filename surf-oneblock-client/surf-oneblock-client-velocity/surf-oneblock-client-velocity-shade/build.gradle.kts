plugins {
    id("dev.slne.surf.api.gradle.velocity")
}

dependencies {
    api(projects.surfOneblockClient.surfOneblockClientCommon.surfOneblockClientCommonShade)
    api(projects.surfOneblockClient.surfOneblockClientVelocity.surfOneblockClientVelocityApi)
}