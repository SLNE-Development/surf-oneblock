plugins {
    id("dev.slne.surf.api.gradle.paper-plugin")
}

surfPaperPluginApi {
    mainClass("dev.slne.surf.oneblock.client.paper.shade.PaperMain")
}

dependencies {
    api(projects.surfOneblockClient.surfOneblockClientCommon.surfOneblockClientCommonShade)
    api(projects.surfOneblockClient.surfOneblockClientPaper.surfOneblockClientPaperApi)

    // Modules
    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserClient.surfOneblockUserClientPaper)
    api(projects.surfOneblockModules.surfOneblockOneblock.surfOneblockOneblockClient.surfOneblockOneblockClientPaper)
}
