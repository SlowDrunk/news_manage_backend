function handleDbPromise(sql, db) {
	return new Promise((resolve, reject) => {
		db.query(sql, (err, results) => {
			if (err) {
				console.log("数据库连接出错", err);
				// ctx.throw(500, "Internal Server Error");
				throw err;
			}
			resolve({ data: results });
		});
	});
}

module.exports = handleDbPromise;
