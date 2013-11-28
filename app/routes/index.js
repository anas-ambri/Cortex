module.exports =  {
    index : function(req, res){
	res.render('index', { title: 'Cortex' });
    },
    history : function(req, res){
	var channel = req.query.channel;
	req.cortex.getMessagesChannel(channel, function(err, messages){
	    if(err)
		res.json(400, err.message);
	    else {
		res.json(200, messages);
	    }
	});
    }
};
