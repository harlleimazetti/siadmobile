function get_config(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM config WHERE id = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var config = new Object();
				var row = result.rows.item(0);
				config.id			= row.id;
				config.url_servidor	= row.url_servidor;
				config.usuario_id	= row.usuario_id;
				config.nome			= row.nome;
				config.unidade		= row.unidade;
				config.setor		= row.setor;
				config.cargo		= row.cargo;
				config.matricula	= row.matricula;
				fn(config);
			}
		});
	});
}

function salvar_config(config, operacao_bd, fn)
{
	db.transaction(function (tx)
	{
		if (operacao_bd == 'novo')
		{
			var sql = "INSERT INTO config (" +
					"url_servidor, " + 
					"usuario_id, " + 
					"nome, " + 					
					"unidade, " + 
					"setor, " + 
					"cargo, " + 
					"matricula " + 
				") VALUES ( " +
					"'" + config.url_servidor + "', " + 
					"'" + config.usuario_id + "', " + 
					"'" + config.nome + "', " + 
					"'" + config.unidade + "', " + 
					"'" + config.setor + "', " + 
					"'" + config.cargo + "', " + 
					"'" + config.matricula + "' " + 
				")";
		} else {
			var sql = "UPDATE config SET " +
						"url_servidor = '" + config.url_servidor + "', " +  
						"usuario_id = '" + config.usuario_id + "', " + 
						"nome = '" + config.nome + "', " + 
						"unidade = '" + config.unidade + "', " + 
						"setor = '" + config.setor + "', " + 
						"cargo = '" + config.cargo + "', " + 
						"matricula = '" + config.matricula + "' " + 
					" WHERE id = " + config.id;
		}
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

///////// CONFIG INÍCIO

$(document).on('pagebeforeshow', '#config_formulario', function()
{
	var operacao_bd = 'editar'; //sessionStorage.operacao_bd;
	if (operacao_bd == 'editar')
	{
		var config_id = 1; //sessionStorage.config_id;
		get_config(config_id, function(config) {
			$('#config_form #operacao_bd').val(operacao_bd);
			$('#config_form #id').val(config.id);
			$('#config_form #url_servidor').val(config.url_servidor);
		});
	} else {
		var config_id = sessionStorage.config_id;
		get_no_informe(sessionStorage.re_id, function(numero_ordem) {
			$('#config_form #operacao_bd').val(operacao_bd);
			$('#config_form #id').val(config_id);
			$('#config_form #url_servidor').val('');
		});
	}
});

$(document).on('click', '#btn_config_salvar', function(event)
{
	event.preventDefault();
	var dados = $("#config_form").serializeJSON();
	salvar_config(dados, dados.operacao_bd, function(resultado) {
		toast(resultado.mensagem);
		history.back();
	});
});

$(document).on('click', '#btn_config_limpar', function(event)
{
	event.preventDefault();
	$('#config_form #url_servidor').val('');
});

///////// CONFIG FIM