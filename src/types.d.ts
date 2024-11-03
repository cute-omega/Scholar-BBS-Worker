interface PagesBackgroundHandler {
    onRequest(request: Request<unknown, IncomingRequestCfProperties<unknown>>,
        env: Env,
        ctx: ExecutionContext):
        Promise<Response>,

    onRequestOptions(request: Request<unknown, IncomingRequestCfProperties<unknown>>,
        env: Env,
        ctx: ExecutionContext):
        Promise<Response>,

    onRequestGet(request: Request<unknown, IncomingRequestCfProperties<unknown>>,
        env: Env,
        ctx: ExecutionContext):
        Promise<Response>,

    onRequestPost(request: Request<unknown, IncomingRequestCfProperties<unknown>>,
        env: Env,
        ctx: ExecutionContext):
        Promise<Response>,
}
interface Reply {
    content: string, author: string
}
interface Post extends Reply {
    title: string
}