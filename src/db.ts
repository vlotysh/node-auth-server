const mysql = require('mysql');
const util = require('util');

class DBError {
    public stack: object = {};
}

exports.DB = class DB {
    public connection;

    constructor() {
        const connection = mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            user     : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DB,
          });

        connection.connect(function(err: DBError) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        
        console.log('connected as id ' + connection.threadId);
        });

        this.connection = connection;
    }

    query(sql: string, params: object) {
        const query = util.promisify(this.connection.query).bind(this.connection);

        return query(sql, params);
    }

    insert(sql: string, params: object) {
        let that = this;
        return new Promise(function(resolve, reject) {
            that.connection.query(
                sql,
                [params],
                function(err: object, result: object){
                    if (err){
                        reject(err);
                    } else{
                        resolve(result);
                    }
                }
            )});
    }
}
