plugins {
    id("dev.slne.surf.api.gradle.standalone")
}

dependencies {
    api(projects.surfOneblockMicroservice.surfOneblockMicroserviceApi)

    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserMicroservice)
    api(projects.surfOneblockModules.surfOneblockOneblock.surfOneblockOneblockMicroservice)
}
