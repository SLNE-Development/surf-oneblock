pluginManagement {
    repositories {
        gradlePluginPortal()
        maven("https://reposilite.slne.dev/public/")
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
    id("dev.slne.surf.api.gradle.settings") version "+"
}

rootProject.name = "surf-oneblock"

// ------------------------------
// Main
// ------------------------------
// Utils
include("surf-oneblock-shared")

// Client
include("surf-oneblock-client:surf-oneblock-client-common:surf-oneblock-client-common-api")
include("surf-oneblock-client:surf-oneblock-client-common:surf-oneblock-client-common-shade")
include("surf-oneblock-client:surf-oneblock-client-paper:surf-oneblock-client-paper-api")
include("surf-oneblock-client:surf-oneblock-client-paper:surf-oneblock-client-paper-shade")
include("surf-oneblock-client:surf-oneblock-client-velocity:surf-oneblock-client-velocity-api")
include("surf-oneblock-client:surf-oneblock-client-velocity:surf-oneblock-client-velocity-shade")

// Microservice
include("surf-oneblock-microservice:surf-oneblock-microservice-api")
include("surf-oneblock-microservice:surf-oneblock-microservice-shade")

// ------------------------------
// Features
// ------------------------------

// OneBlock
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-api")
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-core:surf-oneblock-oneblock-core-common")
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-core:surf-oneblock-oneblock-core-client")
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-microservice")
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-client:surf-oneblock-oneblock-client-velocity")
include("surf-oneblock-modules:surf-oneblock-oneblock:surf-oneblock-oneblock-client:surf-oneblock-oneblock-client-paper")

// User
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-api")
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-core:surf-oneblock-user-core-common")
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-core:surf-oneblock-user-core-client")
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-microservice")
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-client:surf-oneblock-user-client-paper")
include("surf-oneblock-modules:surf-oneblock-user:surf-oneblock-user-client:surf-oneblock-user-client-velocity")