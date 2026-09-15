plugins {
    id("dev.slne.surf.api.gradle.paper-raw")
}

dependencies {
    api(projects.surfOneblockClient.surfOneblockClientPaper.surfOneblockClientPaperApi)
    api(projects.surfOneblockModules.surfOneblockOneblock.surfOneblockOneblockCore.surfOneblockOneblockCoreClient)
}
