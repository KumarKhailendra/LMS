import { apiSlice } from "../api/apiSlice";


export const videoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        videoResolution: builder.mutation({
            query:(id) => ({
                url: `videos/resolution/${id}`,
                method: "GET",
                credentials: "include" as const
            })
        }),
    }),
});

export const { useVideoResolutionMutation } = videoApi;
