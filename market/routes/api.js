var mysql = require('mysql');
var bodyParser = require('body-parser');
var mysqlConfig = {
	host: 'us-cdbr-iron-east-02.cleardb.net',
	user: 'bec2bf55a5cbdf',
	password: 'aabb9961',
	database: 'heroku_823658acf68aaa0'
	};
var client = mysql.createConnection(mysqlConfig);

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index.jade', {
			title: 'Server for Market'
		});
	});
//login
	app.get('/login', function(req, res) {
		client.query('select * from login', function(error, result){
			if(error) {
				console.log('error');
			}
			else {
				var getQuery = req.query;
				var id = getQuery.id ;
				var pw = getQuery.pw ;
				var userinfo ;
				var confirm = 0;
				for(i=0;i<result.length;i++){
					if(id == result[i].userid && pw == result[i].password){
						userinfo = {
							check: 'true',
							id: result[i].userid,
							pw: result[i].password
						}
						console.log('userid : '+id);
						console.log('password : '+pw);
						console.log('success');
						res.json(userinfo);
						confirm = 1;
						break ;
					}
					else {
						confirm = 0;
					}
				}
				if(confirm == 0){
					console.log('There is no id or password');
					console.log('fail');
					res.json({
						check: 'false'
					});
					res.redirect('/');
				}
			}
		});
	});
//cart
	app.post('/cart', function(req, res) {
			//console.log(req.cartNum);
			var cn = req.body.cartNum;
			console.log(cn);
		client.query('select * from cart', function(error, result){
			if(error) {
				console.log('error');
			}
			else {

				// var getQuery = req.query;
				// var cn = getQuery.cn;
				var check = 0;
				var cartstate = 0;
				var text = 'not';
				for(i=0;i<result.length;i++){
					if(cn == result[i].number && result[i].state == 0){
						check = 1;
						console.log('check : true');
						console.log(result[i].number);
						res.json({
							check: 'true',
							cartnumber: result[i].number
						});
						client.query('insert into cartstate(cart) values (?)', [cn]);  // 사용중 카트로 등록
						client.query('update cart set state = ? where number = ?', [1, cn]);
						break;
					}
					else if(cn == result[i].number && result[i].state == 1){ // 사용중이면 사용중이라고 반환
						console.log('already cart is being used');
						text = 'using';
						break;
					}
					else {
						check = 0;
					}
				}
				if(check == 0){
					console.log('fail');
					res.json({
						check: 'false',
						text: text,
						cartnumber: cn
					});
				}
			}
		});
	});
//barcode
	app.post('/barcode', function(req, res) {

		//console.log(req);
		var bc = req.body.barcode;
		var cartNum = req.body.cartNum;
		console.log('req.body',bc);
		client.query('select * from barcode' ,function(error, result){
			if(error) {
				console.log('error');
			}
			else {
				console.log('req.query',req.query);
				// var getQuery = req.query;
				// var bc = getQuery.bc;
				var check = 0;
				var product ;
				var count = 1;
				for(i=0;i<result.length;i++){
					if(bc == result[i].barcode){
						product = {
								check: 'true',
								barcode: result[i].barcode,
						  	name: result[i].name,
								price: result[i].price,
								count: count
						};
						check = 1;
						console.log('product')
						// 고객의 카트에 담긴 물건을 장바구니에 저장
						client.query('insert into bag(cart, name, price) values (?, ?, ?)', [cartNum, result[i].name, result[i].price]);
						res.json(product);
						break ;
					}
					else{
						check = 0;
					}
				}
				if(check == 0){
					console.log('There is no product');
					res.json({
						check: 'false'
					});
				}
				/*res.render('list.jade', {
					title: 'CapStone Design Page(Database)',
					data: result
				});*/
			}
		});
	});
//counter
	app.get('/counter/:cart', function(req, res) {
		client.query('select * from bag', function(err, result){
			if(err){
				console.log('err');
			}
			else{
				var cart = req.param('cart');
				console.log('req param',cart);
				var total = [];
				var calc = 0;
				var getQuery = req.query;

				for(i=0;i<result.length;i++){
					if(result[i].cart == cart){
						total.push({
							name:result[i].name,
							price:result[i].price
						});
					}
				}
				for(i=0;i<total.length;i++){
					calc = calc+total[i].price
				}
				res.render('counter.jade', {
					title: 'Counter for Market',
					cart: cart,
					total: calc,
					data: total
				});
			}
		});
	});
//payment
app.get('/payment/:cart', function(req, res) {
	var cart = req.param('cart');
	// var cart  = req.query.cart;
	// console.log('cart',cart);
		client.query('select * from bag', function(err, result){
			if(err){
				console.log('err');
			}
			else{
				//var cart = req.param('cart')
				for(i=0;i<result.length;i++){
					if(result[i].cart == cart){
						client.query('delete from bag where cart = ?', [cart]);        //장바구니 비우기
						client.query('delete from cartstate where cart = ?', [cart]);  //사용한 카트 반납
						client.query('update cart set state = ? where number = ?', [0, cart]);
					}
				}
				res.redirect('/counter/'+cart)
			}
		});
	});
app.post('/pay', function(req, res) {
	var cart  = req.body.cartNum;
		client.query('select * from bag where cart = ? ',[cart], function(err, result){
			if(err){
				console.log('err');
			}
			else{
				if(result.length>0){
						res.json({
							check: 'false'
						});
				}else if(result.length==0){
							res.json({
								check: 'true'
							});
				}
			}
		});
	});
app.get('/counterapp', function(req, res) {
	res.render('counterapp', {
		title: 'Server for Market'
	});
	});



}