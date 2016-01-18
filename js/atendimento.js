function get_all_atendimento(fn) 
{
	var usuario_id = sessionStorage.usuario_id;
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM atendimento WHERE profissional_id = '" + usuario_id + "' ORDER BY data_inicio, hora_inicio, id";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var atendimento = new Array;
				for (var i = 0; i < result.rows.length; i++) 
				{
					var row = result.rows.item(i);
					atendimento[i] = new Object();
					atendimento[i].id							= row.id;
					atendimento[i].atendimento_prioridade_id	= row.atendimento_prioridade_id;
					atendimento[i].profissional_id				= row.profissional_id;
					atendimento[i].data_inicio					= row.data_inicio;
					atendimento[i].hora_inicio					= row.hora_inicio;
					atendimento[i].prioridade					= row.prioridade;
					atendimento[i].procedimento					= row.procedimento;
					atendimento[i].paciente						= row.paciente;
					atendimento[i].setor_executante				= row.setor_executante;
					atendimento[i].tipo							= row.tipo;
					atendimento[i].obs							= row.obs;
				}
				fn(atendimento);
			}
		});
	});
}

function get_atendimento(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM atendimento WHERE id = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var atendimento = new Object();
				var row = result.rows.item(0);
				atendimento.id							= row.id;
				atendimento.atendimento_prioridade_id	= row.atendimento_prioridade_id;
				atendimento.profissional_id				= row.profissional_id;
				atendimento.data_inicio					= row.data_inicio;
				atendimento.hora_inicio					= row.hora_inicio;
				atendimento.prioridade					= row.prioridade;
				atendimento.procedimento				= row.procedimento;
				atendimento.paciente					= row.paciente;
				atendimento.setor_executante			= row.setor_executante;
				atendimento.tipo						= row.tipo;
				atendimento.obs							= row.obs;
				fn(atendimento);
			}
		});
	});
}

function get_last_atendimento(fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM atendimento ORDER BY id DESC LIMIT 1";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var atendimento = new Object();
				var row = result.rows.item(0);
				atendimento.id = row.id;
				fn(atendimento);
			}
		});
	});
}

function salvar_atendimento(atendimento, operacao_bd, fn)
{
	db.transaction(function (tx)
	{
		if (operacao_bd == 'novo')
		{			
			var sql = "INSERT INTO atendimento (" +
					"id, " + 
					"atendimento_prioridade_id, " + 
					"profissional_id, " + 
					"data_inicio, " + 
					"hora_inicio, " + 
					"prioridade, " + 
					"procedimento, " + 
					"paciente, " + 
					"setor_executante, " + 
					"tipo, " + 
					"obs " + 
				") VALUES ( " +
					"'" + atendimento.id + "', " + 
					"'" + atendimento.atendimento_prioridade_id + "', " + 
					"'" + atendimento.profissional_id + "', " + 
					"'" + formata_data_db(atendimento.data_inicio) + "', " + 
					"'" + atendimento.hora_inicio + "', " + 
					"'" + atendimento.prioridade + "', " + 
					"'" + atendimento.procedimento + "', " + 
					"'" + atendimento.paciente + "', " + 
					"'" + atendimento.setor_executante + "', " + 
					"'" + atendimento.tipo + "', " + 
					"'" + atendimento.obs + "' " + 
				")";
		} else {
			var sql = "UPDATE atendimento SET " +
						"id = '" + atendimento.id + "', " + 
						"atendimento_prioridade_id = '" + atendimento.atendimento_prioridade_id + "', " + 
						"profissional_id = '" + atendimento.profissional_id + "', " + 
						"data_inicio = '" + formata_data_db(atendimento.data_inicio) + "', " + 
						"hora_inicio = '" + atendimento.hora_inicio + "', " + 
						"prioridade = '" + atendimento.prioridade + "', " + 
						"procedimento = '" + atendimento.procedimento + "', " + 
						"paciente = '" + atendimento.paciente + "', " + 
						"setor_executante = '" + atendimento.setor_executante + "', " + 
						"tipo = '" + atendimento.tipo + "', " + 
						"obs = '" + atendimento.obs + "' " + 
					" WHERE id = " + atendimento.id;
		}
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function atualizar_atendimento(atendimento, fn)
{
	db.transaction(function (tx)
	{
		var sql = "INSERT OR REPLACE INTO atendimento (" +
					"id, " + 
					"atendimento_prioridade_id, " + 
					"profissional_id, " + 
					"data_inicio, " + 
					"hora_inicio, " + 
					"prioridade, " + 
					"procedimento, " + 
					"paciente, " + 
					"setor_executante, " + 
					"tipo, " + 
					"obs " + 
				") VALUES ( " +
					"'" + atendimento.id + "', " + 
					"'" + atendimento.atendimento_prioridade_id + "', " + 
					"'" + atendimento.profissional_id + "', " + 
					"'" + atendimento.data_inicio + "', " + 
					"'" + atendimento.hora_inicio + "', " + 
					"'" + atendimento.prioridade + "', " + 
					"'" + atendimento.procedimento + "', " + 
					"'" + atendimento.paciente + "', " + 
					"'" + atendimento.setor_executante + "', " + 
					"'" + atendimento.tipo + "', " + 
					"'" + atendimento.obs + "' " + 
				")";
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function excluir_atendimento(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "DELETE FROM atendimento WHERE id = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			var resultado = new Object();
			resultado.status = 1;
			resultado.mensagem = 'Registro excluído com sucesso';
			fn(resultado);
		});
	});
}

$(document).on('pagebeforecreate', '#agenda', function()
{
	sincronizar();
	atualizar_agenda();
});

$(document).on('click', '#btn-atualizar', function()
{
	sincronizar();
	atualizar_agenda();
});

function atualizar_agenda() {
	var output = '';
	get_config(1, function(config) {
		sessionStorage.usuario_id = config.usuario_id;
			get_all_atendimento(function(atendimento) {
				output += '<li data-icon="false"><a href="#">Atendimentos</a></li>';
				for (var i = 0; i < atendimento.length; i++)
				{
					output += '<li data-icon="false"><a href="#"><h2>' + atendimento[i].paciente + '</h2><p><strong>' + atendimento[i].procedimento + '</strong></p><p>' + atendimento[i].setor_executante + '</p><p class="ui-li-aside"><strong>' + formata_data(atendimento[i].data_inicio) + '</strong></p></a></li>';
				}
				$('#lista_atendimento').empty();
				$('#lista_atendimento').append(output).listview('refresh');
			});
	});
}
///////// atendimento FIM