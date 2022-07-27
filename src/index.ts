import Env from './config/env';
import CheckStoreRes from './dto/checkStoreRes';
import StockService from './services/stockService';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      const response: CheckStoreRes = await StockService.checkStock(env);
      return Response.json(response);
    } catch (response) {
      return Response.json(response, { status: 500 });
    }
  },
  async scheduled(event: Event, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(StockService.checkStock(env));
  },
};
