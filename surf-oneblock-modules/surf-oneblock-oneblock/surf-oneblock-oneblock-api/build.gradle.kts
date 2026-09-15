plugins {
    id("dev.slne.surf.api.gradle.core")
}

dependencies {
    api(projects.surfOneblockShared)
    api(projects.surfOneblockModules.surfOneblockUser.surfOneblockUserApi)
}
