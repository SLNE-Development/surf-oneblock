plugins {
    id("dev.slne.surf.api.gradle.standalone")
    id("dev.slne.surf.microservice")
}

dependencies {
    api(projects.surfOneblockModules.surfOneblockOneblock.surfOneblockOneblockCore.surfOneblockOneblockCoreCommon)
    api(projects.surfOneblockMicroservice.surfOneblockMicroserviceApi)
}
