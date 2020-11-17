const dotenv = require('dotenv');
const mysql = require('mysql');

exports.DB = class DB {
    constructor() {
        const connection = mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            user     : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DB,
          });

        connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        
        console.log('connected as id ' + connection.threadId);
        });

        this.connection = connection;
    }

    query(sql, params) {
        let that = this;
        return new Promise(function(resolve, reject) {
            that.connection.query(
                sql,
                params,
                function(err, result){                                                
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        resolve(result);
                    }
                }
            )});
    }

    insert(sql, params) {
        console.log(params);




        let that = this;
        return new Promise(function(resolve, reject) {
            that.connection.query(
                sql,
                [params],
                function(err, result){                                                    
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                }
            )});
    }
}
