import InspectRes from './dto/inspectRes';
import Product from './dto/product';
import Telegram from './config/telegram';

export interface Env {
  BOT_TOKEN: string,
  CHAT_ID: string
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const xboxxProductId = 597;
    const targetUrl = 'https://www.microsoftestore.com.hk/product/bundle/baseInfo?code=Xbox-Series-X';
    const res: Response = await fetch(targetUrl);
    const telegram = new Telegram(env.BOT_TOKEN);
    let resData: InspectRes;

    try {
      if (res.ok) {
        const products: Product[] = await res.json() as Product[];
        if (products?.length > 0) {
          const xboxx: Product | undefined = products.find((p) => p.id === xboxxProductId);
          if (xboxx?.bundleQuantity !== 0) {
            const tgMsg = '[] Xbox Series X 有貨喇 \\!\\! \n[立即購買](https://www.microsoftestore.com.hk/product/Xbox-Series-X/MICHK01607)';
            await telegram.sendMessage(env.CHAT_ID, tgMsg);
            resData = {
              success: true,
              inStock: true,
              message: 'In Stock',
            };
          } else if (xboxx?.bundleQuantity === 0) {
            resData = {
              success: true,
              inStock: false,
              message: 'Out of Stock',
            };
          } else {
            throw new Error('Xbox Series X cannot be found');
          }
          return Response.json(resData);
        }
      } else {
        throw new Error(`Fail to fetch data from ms store; msg: ${await res.text()}`);
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        return Response.json({
          success: false,
          message: e.message,
        }, {
          status: 500,
        });
      }
    }

    return Response.json({
      success: false,
    }, {
      status: 500,
    });
  },
};
