import Env from '../config/env';
import Telegram from '../config/telegram';
import CheckStoreRes from '../dto/checkStoreRes';
import Product from '../dto/product';

class StockService {
  static checkStock = async (env: Env): Promise<CheckStoreRes> => new Promise((resolve, reject) => {
    (async () => {
      const xboxxProductId = 597;
      const targetUrl = 'https://www.microsoftestore.com.hk/product/bundle/baseInfo?code=Xbox-Series-X';
      const res: Response = await fetch(targetUrl);
      const telegram = new Telegram(env.BOT_TOKEN);
      let resData: CheckStoreRes = { success: false, message: 'Xbox Series X cannot be found' };

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
            return resolve(resData);
          } if (xboxx?.bundleQuantity === 0) {
            resData = {
              success: true,
              inStock: false,
              message: 'Out of Stock',
            };
            return resolve(resData);
          }
        }
        return reject(resData);
      }
      resData.message = `Fail to fetch data from ms store; msg: ${await res.text()}`;
      return reject(resData);
    })();
  });
}

export default StockService;
