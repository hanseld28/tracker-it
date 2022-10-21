import config from '@/config';
import axios, { AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create({
    baseURL: config.API_BASE_URL
});

interface IClientResult {
    endpoint: string,
    client: AxiosInstance,
}

interface IClientConfigurer {
    client: AxiosInstance,
    targetEndpoint: string,
    do: <T>(callbackFn: (options: IClientResult) => T) => T,
}

interface IRequestBuilder {
    ref: IClientConfigurer,
    endpoints: string[],
    add: (partOfUrl: string | number) => IRequestBuilder,
    build: () => IClientConfigurer
}

export function makeRequest(initialEndpoint?: string) : IRequestBuilder {
    const clientConfigurer: IClientConfigurer = {
        client,
        targetEndpoint: initialEndpoint || '',
        do<T>(callbackFn: (options: IClientResult) => T): T  {
            const result: IClientResult = {
                endpoint: this.targetEndpoint,
                client,
            };

            this.targetEndpoint = '';
            
            return callbackFn(result);
        },
    };

    const requestBuilder: IRequestBuilder = {
        ref: clientConfigurer,
        endpoints: [] as string[],
        add(partOfUrl: string | number): IRequestBuilder {
            this.endpoints.push(`${partOfUrl}`);
            return this;
        },
        build() {
            this.ref.targetEndpoint = `/${this.endpoints.join('/')}`;
            this.endpoints = [];
            return this.ref;
        },
    }

    return requestBuilder;
}
