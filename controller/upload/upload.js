/**
 * Create by Zwl on 2019/7/1
 * @Description: 上传
 */

'use strict';


import fs from 'fs';
import path from 'path';
import mkdirs from '../../until/mkdir';

class Upload{

    /**
     * 图片上传
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async uploadFiles(ctx,next){
        const file = ctx.request.files.file; // 获取上传文件
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(process.cwd(), '/public/images/');
        const promise = new Promise(async (resolve, reject) =>{
            await mkdirs(filePath,()=>{
                // 创建可写流
                const upStream = fs.createWriteStream(filePath+`${file.name}`);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
                let new_file_path = '/'+`${file.name}`;
                ctx.body = {
                    code: 1,
                    imgUrl: new_file_path
                }
                resolve(next());
            });
        });
        await promise;
    }
}

export default new Upload();
