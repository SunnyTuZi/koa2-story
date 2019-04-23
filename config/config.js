/**
 * Create by Zwl on 2019/4/9
 * @Description: 配置文件
 */

'use strict';

const config = {
    //数据库地址
    'dbUrl': 'mongodb://localhost:27017/runoob',
    //token配置
    'token':{
        'serect': 'storyKey',
        'time': '1h'
    }
}
export default config
