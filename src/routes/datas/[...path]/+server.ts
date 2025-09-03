import type { RequestHandler } from './$types';
import { readFileSync, statSync} from 'fs';
import { extname, join } from 'path';
const route=join(process.cwd(), 'datas');
const MIME_MAP: Record<string, string> = {
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp':'image/webp',
  // fallback
  default: 'application/octet-stream'
};
export const GET: RequestHandler = async (e) => {
     try {
    const filePath = join(route, e.params.path);
       const stats = statSync(filePath);
    if (!stats.isFile())  return new Response('Not found', { status: 404 });
     const ext = extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] ?? MIME_MAP.default;
    const file = readFileSync(filePath);
    const cacheControl = `public, max-age=${contentType==MIME_MAP.default?600:31536000}, immutable`;
    const eTag = `"${stats.size}-${stats.mtimeMs}"`;
    const lastModified = new Date(stats.mtime).toUTCString();

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'ETag': eTag,
        'Last-Modified': lastModified
      }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
