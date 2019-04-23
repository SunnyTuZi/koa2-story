/**
 * Create by Zwl on 2019/4/23
 * @Description:
 */

'use strict';
import fs from 'fs'
import path from 'path'

/**
 *
 * @param url json地址
 * @returns {Promise<any>}
 */
const postJson = (url) =>  {
    return new Promise(
        async (resolve, reject) => {
            await fs.readFile(url, function (err, data) {
                if (err) {
                    reject();
                }else{
                    let jsonData = data.toString();
                    jsonData = JSON.parse(jsonData);
                    resolve(jsonData);
                }
            });
        }
    )
}

class City {
    constructor() {
        this.getProvince.bind(this);
        this.getCity.bind(this);
    }

    async getProvince(ctx, next) {
        let url = path.join(__dirname, '../../public/javascripts/json/provinces.json')
        await postJson(url).then(
            result =>{
                ctx.body = {
                    status: 200,
                    data: result,
                    msg: '请求成功'
                }
                next();
            }
        ).catch(
            err =>{
                ctx.body = {
                    status: 500,
                    msg: '获取数据失败'
                }
            }
        );
    }

    async getCity(ctx,next) {
        let url = path.join(__dirname, '../../public/javascripts/json/cities.json')
        await postJson(url).then(
            result =>{
                ctx.body = {
                    status: 200,
                    data: result,
                    msg: '请求成功'
                }
                next();
            }
        ).catch(
            err =>{
                ctx.body = {
                    status: 500,
                    msg: '获取数据失败'
                }
            }
        );
    }


}

export default new City();
