plugins {
    id("dev.slne.surf.api.gradle.standalone")
    id("dev.slne.surf.microservice")
}

dependencies {
    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserCore.surfOneblockUserCoreCommon)
    api(projects.surfOneblockMicroservice.surfOneblockMicroserviceApi)
}
