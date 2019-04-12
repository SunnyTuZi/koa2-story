/**
 * Create by Zwl on 2019/4/11
 * @Description: 创建文件夹
 */

'use strict';

import fs from 'fs'
import path from 'path'

/**
 * 创建文件夹
 * @param dirpath 文件路径
 * @param callback 回调函数
 */

const mkdirs = function(dirpath, callback) {
    fs.stat(dirpath, function(err) {
        if(!err) {
            callback();
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), function(){
                fs.mkdir(dirpath,callback);
            });
        }
    })
};

export default mkdirs
