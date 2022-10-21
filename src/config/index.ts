enum EnvironmentType {
    ALL = 'ALL',
    DEVELOPMENT = 'DEVELOPMENT',
    HOMOLOG = 'HOMOLOG',
    PRODUCTION = 'PRODUCTION',
}

type EnvironmentValue = {
    [key: string]: string,
}

export type Configuration = {
    [env: string]: EnvironmentValue,
}
const ALL_ENVIRONMENT_CONFIG_VALUE: EnvironmentValue = {
    PROJECTS_API_ENDPOINT: 'projects',
    TASKS_API_ENDPOINT: 'tasks',
};

const config: Configuration = {
    [EnvironmentType.DEVELOPMENT]: {
        ...ALL_ENVIRONMENT_CONFIG_VALUE,
        API_BASE_URL: 'http://localhost:3000',
    },
    [EnvironmentType.HOMOLOG]: {
        ...ALL_ENVIRONMENT_CONFIG_VALUE,
        API_BASE_URL: 'http://localhost:3000',
    },
    [EnvironmentType.PRODUCTION]: {
        ...ALL_ENVIRONMENT_CONFIG_VALUE,
        API_BASE_URL: 'http://localhost:3000',
    },
}

export default config[EnvironmentType.DEVELOPMENT];