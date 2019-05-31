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
        'time': '24h'
    },
    //分组存在时间小时为单位
    'groupInHour': 1
}
export default config
