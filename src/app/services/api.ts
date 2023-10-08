import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Request = {
    seed: string;
    nat: string;
    page: number;
};

export type UserResponse = {
    id: {
        name: string;
        value: string;
    };
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: {
        street: {
            number: number;
            name: string;
        };
        city: string;
        state: string;
        postcode: string;
    };
    phone: string;
};

const defaultQueryParams = {
    noinfo: '',
    results: 20,
    inc: 'id,name,location,phone',
};

const usersApi = import.meta.env.VITE_USERS_API;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: usersApi,
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<{ results: UserResponse[] }, Request>({
            query: (request) => ({
                url: '',
                params: { ...defaultQueryParams, ...request },
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return (
                    typeof currentArg !== typeof previousArg ||
                    (!!currentArg &&
                        !!previousArg &&
                        !Object.values(currentArg).every(
                            (el, ind) => Object.values(previousArg)[ind] === el
                        ))
                );
            },
        }),
    }),
});

export default apiSlice;

export const { useGetUsersQuery } = apiSlice;
