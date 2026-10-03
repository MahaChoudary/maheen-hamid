import { handle,options,methodNotAllowed } from '@/server/http/handler';
export const runtime='nodejs';
export const maxDuration=30;
export const POST=(request:Request)=>handle(request,'match');
export const OPTIONS=options;
export const GET=methodNotAllowed;
