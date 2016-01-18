var db = openDatabase ("siadmobile", "1.0", "SIAD Mobile", 65535);
db.transaction (function (transaction) 
{
	console.log('Configurando Banco de Dados...');

	//var sql = "DROP TABLE config";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS config " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"url_servidor VARCHAR(200), " +
		"usuario_id INTEGER, " +
		"nome VARCHAR(100), " + 
		"unidade VARCHAR(100), " + 
		"setor VARCHAR(100), " +
		"cargo VARCHAR(50), " + 
		"matricula VARCHAR(50) " + 
		")"
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);
	
	var sql = "INSERT OR IGNORE INTO config (id, url_servidor) VALUES ('1', 'http://192.168.100.4/siadmobile/sincronizar.php') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);
	
	//var sql = "DROP TABLE usuario";
	//transaction.executeSql (sql, undefined, function() { }, error);

	var sql = "CREATE TABLE IF NOT EXISTS usuario " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"cargo_id INTEGER, " +
		"setor_id INTEGER, " +
		"situacao_id INTEGER, " +
		"ativo VARCHAR(1), " + 
		"login VARCHAR(100), " +
		"senha VARCHAR(50), " + 
		"matricula VARCHAR(50), " + 
		"nome VARCHAR(100), " + 
		"cpf VARCHAR(15), " + 
		"situacao VARCHAR(100), " + 
		"status VARCHAR(50), " + 
		"ano_referencia VARCHAR(4), " +
		"mes_referencia VARCHAR(2), " +
		"ch_mensal INTEGER, " + 
		"valor REAL(15,2), " + 
		"email VARCHAR(100), " + 
		"nivel VARCHAR(1), " +
		"numacesso INTEGER, " + 
		"ultimo_acesso DATE, " + 
		"hora_ultimo_acesso TIME, " + 
		"obs TEXT " + 
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);
	
	//var sql = "DROP TABLE atendimento";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS atendimento " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"setor_executante_id INTEGER, " +
		"setor_solicitante_id INTEGER, " +
		"usuario_id INTEGER, " +
		"procedimento_id INTEGER, " +
		"especialidade_id INTEGER, " +
		"profissional_id INTEGER, " +
		"paciente_id INTEGER, " +
		"atendimento_status_id INTEGER, " +
		"atendimento_tipo_id INTEGER, " +
		"atendimento_prioridade_id INTEGER, " +
		"data_inclusao DATE, " +
		"data_inicio DATE, " +
		"data_termino DATE, " +
		"hora_inclusao TEXT, " +
		"hora_inicio TEXT, " +
		"hora_termino TEXT, " +
		"obs TEXT, " + 
		"especialidade TEXT, " + 
		"procedimento TEXT, " + 
		"setor_executante TEXT, " + 
		"setor_solicitante TEXT, " + 
		"paciente TEXT, " + 
		"status TEXT, " + 
		"tipo TEXT, " + 
		"prioridade TEXT " + 
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);
});

function ok ()
{
}

function error (transaction, err) 
{
	console.log("Erro no banco de dados: " + err.message);
	return false;
}