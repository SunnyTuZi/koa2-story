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
}

export default new Visit();
