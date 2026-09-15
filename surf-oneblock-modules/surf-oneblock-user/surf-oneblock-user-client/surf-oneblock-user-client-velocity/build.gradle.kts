plugins {
    id("dev.slne.surf.api.gradle.core")
}

dependencies {
    api(projects.surfOneblockClient.surfOneblockClientVelocity.surfOneblockClientVelocityApi)
    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserCore.surfOneblockUserCoreClient)
}