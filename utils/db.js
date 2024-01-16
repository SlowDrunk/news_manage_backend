const MySQL = require("mysql");

const pool = MySQL.createPool({
	host: "localhost",
	port: 3306,
	database: "user",
	user: "root",
	password: "lj1224...",
});

// 对数据库进行操作
function query(sql, callback) {
	pool.getConnection((err, connection) => {
		if (err) {
			callback(err);
		} else {
			connection.query(sql, (err, results) => {
				callback(err, results);
				connection.release();
			});
		}
	});
}

exports.query = query;

