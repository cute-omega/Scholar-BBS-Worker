export default {
    async onRequest(request, env, ctx) {
        let response: Response;
        switch (request.method) {
            case 'GET':
                response = await this.onRequestGet(request, env, ctx);
                break;
            case 'POST':
                response = await this.onRequestPost(request, env, ctx);
                break;
            case 'OPTIONS':
                response = await this.onRequestOptions(request, env, ctx);
                break;
            default:
                response = new Response('Method Not Allowed', { status: 405 });
        }

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Max-Age', '86400');
        return response;
    },
    async onRequestOptions(request, env, ctx) {
        const response = new Response();
        response.status = 204;
        response.headers.set('Access-Control-Allow-Headers', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        return response;
    },
    async onRequestGet(request, env, ctx) {
        const url = new URL(request.url);
        // 获取分页参数
        const pageLimit = 30; // 每页显示的帖子数量，默认30
        const pageOffset = parseInt(url.searchParams.get('offset')!) || 0; // 偏移量，默认0
        // 获取所有帖子
        const posts = await env.DB.prepare('SELECT * FROM posts LIMIT ? OFFSET ?')
            .bind(pageLimit, pageOffset)
            .all();
        return new Response(JSON.stringify(posts), {
            headers: { 'Content-Type': 'application/json' }
        });
    },
    async onRequestPost(request, env, ctx) {
        const url = new URL(request.url);
        // 创建新帖子
        const { title, content, author } = await request.json<Post>();
        const maxPostIdResult = await env.DB.prepare('SELECT MAX(id) as maxId FROM posts').first();
        const newPostId = (Number(maxPostIdResult!.maxId) ?? 0) + 1;
        const result = await env.DB.prepare('INSERT INTO posts (id, title, content, author, date, score) VALUES (?, ?, ?, ?, ?, 0)')
            .bind(newPostId, title, content, author, new Date().toISOString())
            .run();
        const newPost = await env.DB.prepare('SELECT * FROM posts WHERE id = ?')
            .bind(newPostId)
            .first();
        return new Response(JSON.stringify(newPost), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
} satisfies PagesBackgroundHandler;