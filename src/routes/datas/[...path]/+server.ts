import type { RequestHandler } from './$types';
import { readFileSync} from 'fs';
import { join } from 'path';
const route=join(process.cwd(), 'datas');
export const GET: RequestHandler = async (e) => {
     try {
    const filePath = join(route, e.params.path);
    const file = readFileSync(filePath);
    
    return new Response(file, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
