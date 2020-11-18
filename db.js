const dotenv = require('dotenv');
const mysql = require('mysql');
const util = require('util');

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
        const query = util.promisify(this.connection.query).bind(this.connection);

        return query(sql, params);
    }

    insert(sql, params) {
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
