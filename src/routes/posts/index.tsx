import { createFileRoute, Link } from '@tanstack/react-router'
import { postsSearchSchema, type PostsResponse } from '../../schemas/posts.schema'

export const Route = createFileRoute('/posts/')({
    component: RouteComponent,
    validateSearch: postsSearchSchema,
    loaderDeps: ({ search: { search } }) => ({search}),
    loader: async ({ deps: { search } }) => {
        const response = await fetch('/posts.json')
        const data: PostsResponse = await response.json()
        return {
            posts: data.posts.filter(post=> post.title.includes(search) || post.summary.includes(search)),
        }
    },
    staleTime: 10_000,
})

function RouteComponent() {
    const { posts } = Route.useLoaderData()
    const { search, page, pageSize } = Route.useSearch()

    if (posts) console.log("Posts loaded:", posts)
    console.log("Search params:", { search, page, pageSize })

    return (
        <div>
            Hello "/posts/"! {" "}
            <Link to='/posts/$postId' params={{ postId: "hola-this-is-post-ID-1" }}>Hello this is Post1</Link>
        </div>
    )
}
