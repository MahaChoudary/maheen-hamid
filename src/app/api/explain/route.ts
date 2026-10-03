import { handle,options,methodNotAllowed } from '@/server/http/handler';
export const runtime='nodejs';
export const maxDuration=30;
export const POST=(request:Request)=>handle(request,'explain');
export const OPTIONS=options;
export const GET=methodNotAllowed;
