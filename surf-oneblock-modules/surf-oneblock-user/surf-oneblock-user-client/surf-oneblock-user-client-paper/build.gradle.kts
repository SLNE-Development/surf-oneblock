plugins {
    id("dev.slne.surf.api.gradle.core")
}

dependencies {
    api(projects.surfOneblockClient.surfOneblockClientPaper.surfOneblockClientPaperApi)
    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserCore.surfOneblockUserCoreClient)
}