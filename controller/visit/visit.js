/**
 * Create by Zwl on 2019/7/10
 * @Description: 访问控制器
 */

'use strict';

import VisitModel from '../../model/visit/visit';

class Visit {
    constructor() {
        this.addVisitRecord.bind(this);
    }
    async addVisitRecord(ctx){
        let form = ctx.request.body;
        const promise = new Promise( async (resolve, reject) =>{
            await VisitModel.addRecord(form,(err,docs)=>{
               if(err){
                   ctx.body = {
                       code:0
                   }
                   reject();
               }else{
                   ctx.body ={
                       code:1
                   }
                   resolve();
               }
            });
        });
        await promise;
    }
    async getVisitCount(ctx){
        const promise = new Promise( async (resolve, reject) =>{
            await VisitModel.getVisitCount((err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0
                    }
                    reject();
                }else{
                    var obj = {'游客访问':{},'用户访问':{}};
                    var now_date = new Date();
                    var now_timep = now_date.getTime();
                    for (let i = 0; i < 7 ; i ++) {
                        var _date = new Date(now_timep - i*24*60*60*1000).format('MM-dd');
                        obj['游客访问'][_date] = 0;
                        obj['用户访问'][_date] = 0;
                    }
                    for (let i = 0; i < docs.length; i ++) {
                        var visits = docs[i].visits;
                        var type = docs[i]._id == 0 ? '游客访问':'用户访问';
                        for (let j = 0; j < visits.length; j ++) {
                            var day = new Date(visits[j]).format('MM-dd');
                            obj[type][day] += 1;
                        }
                    }
                    ctx.body ={
                        code:1,
                        data:obj
                    }
                    resolve();
                }
            });
        });
        await promise;
    }


}

export default new Visit();
