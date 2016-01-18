function get_all_lancamentos(fn) 
{
	var id_conta = sessionStorage.id_conta;
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM lancamentos WHERE id_conta = '" + id_conta + "' ORDER BY data, id_lancamento";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var lancamentos = new Array;
				for (var i = 0; i < result.rows.length; i++) 
				{
					var row = result.rows.item(i);
					lancamentos[i] = new Object();
					lancamentos[i].id_lancamento	= row.id_lancamento;
					lancamentos[i].id_conta			= row.id_conta;
					lancamentos[i].id_tabela		= row.id_tabela;
					lancamentos[i].data				= row.data;
					lancamentos[i].descricao		= row.descricao;
					lancamentos[i].dc				= row.dc;
					lancamentos[i].valor			= row.valor;
				}
				fn(lancamentos);
			}
		});
	});
}

function get_lancamentos(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM lancamentos WHERE id_lancamento = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var lancamentos = new Object();
				var row = result.rows.item(0);
				lancamentos.id_lancamento	= row.id_lancamento;
				lancamentos.id_conta		= row.id_conta;
				lancamentos.id_tabela		= row.id_tabela;
				lancamentos.data			= row.data;
				lancamentos.descricao		= row.descricao;
				lancamentos.dc				= row.dc;
				lancamentos.valor			= row.valor;
				fn(lancamentos);
			}
		});
	});
}

function get_last_lancamentos(fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM lancamentos ORDER BY id_lancamento DESC LIMIT 1";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var lancamentos = new Object();
				var row = result.rows.item(0);
				lancamentos.id_lancamento = row.id_lancamento;
				fn(lancamentos);
			}
		});
	});
}

function salvar_lancamentos(lancamentos, operacao_bd, fn)
{
	db.transaction(function (tx)
	{
		if (operacao_bd == 'novo')
		{
			var sql = "INSERT INTO lancamentos (" +
					"id_lancamento, " + 
					"id_conta, " + 
					"id_tabela, " + 
					"data, " + 
					"descricao, " + 
					"dc, " + 
					"valor " +  
				") VALUES ( " +
					"'" + lancamentos.id_lancamento + "', " + 
					"'" + lancamentos.id_conta + "', " + 
					"'" + lancamentos.id_tabela + "', " + 
					"'" + formata_data_db(lancamentos.data) + "', " + 
					"'" + lancamentos.descricao + "', " + 
					"'" + lancamentos.dc + "', " + 
					"'" + lancamentos.valor + "' " + 
				")";
		} else {
			var sql = "UPDATE lancamentos SET " +
						"id_conta = '" + lancamentos.id_conta + "', " +  
						"id_tabela = '" + lancamentos.id_tabela + "', " + 
						"data = '" + formata_data_db(lancamentos.data) + "', " + 
						"descricao = '" + lancamentos.descricao + "', " + 
						"dc = '" + lancamentos.dc + "', " + 
						"valor = '" + lancamentos.valor + "'" + 
					" WHERE id_lancamento = " + lancamentos.id_lancamento;
		}
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function atualizar_lancamentos(lancamentos, fn)
{
	db.transaction(function (tx)
	{
		var sql = "INSERT OR REPLACE INTO lancamentos (" +
					"id_lancamento, " + 
					"id_conta, " + 
					"id_tabela, " + 
					"data, " + 
					"descricao, " + 
					"dc, " + 
					"valor " +  
				") VALUES ( " +
					"'" + lancamentos.id_lancamento + "', " + 
					"'" + lancamentos.id_conta + "', " + 
					"'" + lancamentos.id_tabela + "', " + 
					"'" + lancamentos.data + "', " + 
					"'" + lancamentos.descricao + "', " + 
					"'" + lancamentos.dc + "', " + 
					"'" + lancamentos.valor + "' " + 
				")";
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function excluir_lancamentos(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "DELETE FROM lancamentos WHERE id_lancamento = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			var resultado = new Object();
			resultado.status = 1;
			resultado.mensagem = 'Registro excluído com sucesso';
			fn(resultado);
		});
	});
}

/////// LANÇAMENTOS LISTA

$(document).on('pagebeforecreate', '#extrato', function()
{
	sincronizar();
	atualizar_extrato();
});

$(document).on('click', '#btn-atualizar', function()
{
	sincronizar();
	atualizar_extrato();
});

function atualizar_extrato() {
	var output = '';
	get_config(1, function(config) {
		sessionStorage.id_pessoa = config.id_pessoa;
		get_contas_pessoa(sessionStorage.id_pessoa, function(conta) {
			sessionStorage.id_conta = conta.id_conta;
			$('.conta_numero').html(conta.numero);
			$('.conta_data_abertura').html(formata_data(conta.data_abertura));
			$('.conta_saldo_inicial').html(conta.saldo_inicial.format(2, 3, '.', ','));
			calcula_saldo();
			get_all_lancamentos(function(lancamento) {
				output += '<li data-icon="false" data-theme="c"><a href="#"><div class="ui-grid-b"><div class="ui-block-a" style="width:27%;"><p class="profile_texto">Data</p></div><div class="ui-block-b" style="width:46%;"><p class="profile_texto" style="white-space:normal !important;">Descrição</p></div><div class="ui-block-b" style="width:27%;"><p class="profile_texto" style="text-align:right">Valor</p></div></div></a></li>';
				var ano_anterior = '';
				for (var i = 0; i < lancamento.length; i++)
				{
					var ano = formata_data(lancamento[i].data).slice(-4);
					if (ano != ano_anterior) {
						output += '<li data-icon="false" data-role="list-divider">' + ano + '</li>';
					}
					output += '<li data-icon="false" id="'+ lancamento[i].id_lancamento + '" data-id="' + lancamento[i].id_lancamento + '"><a href="#"><div class="ui-grid-b"><div class="ui-block-a" style="width:27%;"><p class="profile_texto">' + formata_data(lancamento[i].data) + '</p></div><div class="ui-block-b" style="width:46%;"><p class="profile_texto" style="white-space:normal !important;">' + lancamento[i].descricao + '</p></div><div class="ui-block-b" style="width:27%;"><p class="profile_texto" style="text-align:right">' + lancamento[i].valor.format(2, 3, '.', ',') + ' ' + lancamento[i].dc + '</p></div></div></a></li>';
					ano_anterior = ano;
				}
				var saldo = parseFloat(sessionStorage.saldo).format(2, 3, '.', ',');
				$('#lista_lancamentos').empty();
				$('#lista_lancamentos').append(output).listview('refresh');
				$('.conta_saldo').html(saldo);
			});
		});
	});
}

function calcula_saldo() {
	var saldo = 0;
	get_contas_pessoa(sessionStorage.id_pessoa, function(conta) {
		sessionStorage.setItem('id_conta', conta.id_conta);
		saldo = conta.saldo_inicial;
		get_all_lancamentos(function(lancamento) {
			var saldo_parcial = new Object();
			saldo_parcial.data = new Array;
			saldo_parcial.valor = new Array();
			saldo_parcial.subtotal = new Array();
			saldo_parcial.deposito = 0;
			saldo_parcial.rendimento = 0;
			for (var i = 0; i < lancamento.length; i++)
			{
				if (lancamento[i].dc == 'C') {
					saldo += lancamento[i].valor;
					if (lancamento[i].descricao.indexOf('DEPÓSITO') != -1) {
						saldo_parcial.deposito += lancamento[i].valor;
					}
					if (lancamento[i].descricao.indexOf('CORREÇÃO') != -1) {
						saldo_parcial.rendimento += lancamento[i].valor;
					}
				} else {
					saldo -= lancamento[i].valor;
				}
				saldo_parcial.data.push(formata_data(lancamento[i].data));
				saldo_parcial.valor.push(lancamento[i].valor);
				saldo_parcial.subtotal.push(saldo);
			}
			sessionStorage.saldo = saldo;
			sessionStorage.setItem('saldo_parcial', JSON.stringify(saldo_parcial));
			$('.conta_saldo').html(saldo.format(2, 3, '.', ','));
		});
	});
}
///////// LANÇAMENTOS FIM