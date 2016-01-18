<?php
	header("content-type: text/javascript");
	//header("Content-Type: application/json");
	
	$connection=mysql_connect("localhost","root","");
	$db = mysql_select_db("siad",$connection);
	
	if (isset($_POST['acao'])) {
		$acao = $_POST['acao'];
		$dados = $_POST;
		$callback = '';
	} else if (isset($_GET['acao'])) {
		$acao = $_GET['acao'];
		$dados = $_GET['dados'];
		$callback = $_GET['callback'];
	} else {
		$acao = '';
		$dados = '';
		$callback = '';
	}
	
	if ($acao == 'sincronizar') {
		$resultado = sincronizar($dados);
	}
	
	if ($acao == 'registrar') {
		$resultado = registrar($dados);
	}
	
	if ($callback != '') {
		echo $_GET['callback'].'(' . json_encode($resultado).');';
	} else {
		echo json_encode($resultado);
	}
	
	exit;
	
	function sincronizar($dados) {
		mysql_query('SET CHARACTER SET utf8');
		$resultado = array();
		$resultado['status'] = '';
		$resultado['mensagem'] = '';
		$resultado['dados'] = $dados;
		$s1 = "SELECT * FROM usuario WHERE id = '".$dados['usuario_id']."' ORDER BY id LIMIT 1";
		$q1 = mysql_query($s1);
		$usuario = array();
		$a = 0;
		while ($r1 = mysql_fetch_assoc($q1)) {
			$usuario[$a] = $r1;
			$s2 = "	SELECT
						at.*,
						es.nome AS especialidade,
						pr.NO_PROCEDIMENTO AS procedimento,
						sex.nome AS setor_executante,
						ses.nome AS setor_solicitante,
						pa.nome AS paciente,
						ats.descricao AS status,
						atp.nome AS tipo,
						atpr.descricao AS prioridade
					FROM atendimento AS at
					LEFT JOIN especialidade AS es ON es.id = at.especialidade_id
					LEFT JOIN procedimento AS pr ON pr.id = at.procedimento_id
					LEFT JOIN setor AS sex ON sex.id = at.setor_executante_id
					LEFT JOIN setor AS ses ON ses.id = at.setor_solicitante_id
					LEFT JOIN paciente AS pa ON pa.id = at.paciente_id
					LEFT JOIN atendimento_status AS ats ON ats.id = at.atendimento_status_id
					LEFT JOIN atendimento_tipo AS atp ON atp.id = at.atendimento_tipo_id
					LEFT JOIN atendimento_prioridade AS atpr ON atpr.id = at.atendimento_prioridade_id
					WHERE profissional_id = '".$r1['id']."' ORDER BY data_inicio, hora_inicio, id";
			$q2 = mysql_query($s2);
			echo mysql_error();
			$usuario[$a]["atendimento"] = array();
			$b = 0;
			while ($r2 = mysql_fetch_assoc($q2)) {
				$usuario[$a]["atendimento"][$b] = $r2;
				$b++;
			}
			$a++;
		}
		$resultado['usuario'] = $usuario;
		return $resultado;
	}
	
	function registrar($dados) {
		mysql_query('SET CHARACTER SET utf8');
		$resultado = array();
		$resultado['status'] = '';
		$resultado['mensagem'] = '';
		//$resultado['dados'] = $dados;
		
		$usuario = array();
		
		if($dados['login'] != '' and $dados['senha'] != '') {
			$s1 = "	SELECT
						us.*,
						se.nome AS setor,
						ca.nome AS cargo,
						un.nome AS unidade
					FROM usuario AS us
					LEFT JOIN setor AS se ON us.setor_id = se.id
					LEFT JOIN cargo AS ca ON us.cargo_id = ca.id
					LEFT JOIN unidade AS un ON se.unidade_id = un.id
					WHERE us.login = '" . $dados['login']. "'
						AND us.senha = '" . md5($dados['senha']) . "'
					LIMIT 1";
			$q1 = mysql_query($s1);
			echo mysql_error();
			if (mysql_num_rows($q1) > 0) {
				$r1 = mysql_fetch_assoc($q1);
				$usuario[0] = $r1;
				$resultado['status'] = 'ok';
				$resultado['mensagem'] = 'Login efetuado com sucesso';
			} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Erro no login! Usuário não encontrado.';
			}
		} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Erro no login! Login ou senha inválidos.';
		}
		$resultado['usuario'] = $usuario;
		return $resultado;
	}
	
	function sql($tabela, $dados) {
		$resultado = array();
		mysql_query('SET CHARACTER SET utf8');
		if(is_array($dados)) {
			$s = "SELECT * FROM `".$tabela."` WHERE id = '".$dados['id']."' AND re_id='".$dados['re_id']."'";
			$q = mysql_query($s);
			$n = mysql_num_rows($q);
			if ($n <= 0) {
				$campos = implode(", ", array_keys($dados));
				$valores = array_map('mysql_real_escape_string', array_values($dados));
				$valores = "'" . implode("', '", $valores) . "'";
				$sql = "INSERT INTO `".$tabela."` ($campos) VALUES ($valores)";
    			mysql_query($sql);
			} else {
				foreach ($dados as $key => $value) {
					$value = mysql_real_escape_string($value); // this is dedicated to @Jon
					$value = "'$value'";
					$updates[] = "$key = $value";
				}
				$implodeArray = implode(', ', $updates);
				$sql = "UPDATE `".$tabela."` SET $implodeArray WHERE id='".$dados['id']."'";
				mysql_query($sql);
			}
			if (!mysql_error()) {
				$resultado['status'] = 'ok';
				$resultado['mensagem'] = 'Registros gravados com sucesso';
				$resultado['registro'] = $dados;
			} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Problema na gravação dos registros: ' . mysql_error() . ', ' . $sql;
				$resultado['registro'] = $dados;
			}
		} else {
			$resultado['status'] = 'er';
			$resultado['mensagem'] = 'Dados inválidos';
			$resultado['registro'] = $dados;
		}
		return $resultado;
	}
	
	function upload_imagem($dados) {
		$arquivo	= $_FILES["arquivo"]["tmp_name"]; 
		$tamanho	= $_FILES["arquivo"]["size"];
		$tipo		= $_FILES["arquivo"]["type"];
		$nome		= $_FILES["arquivo"]["name"];

		$fp = fopen($arquivo, "rb");
		$conteudo = fread($fp, $tamanho);
		$conteudo = addslashes($conteudo);
		fclose($fp);
		$s = "UPDATE ".$dados['tb']." SET ".$dados['cp']." = '".$conteudo."' WHERE id = ".$dados['id'];
		$q = mysql_query($s);
		
		//$resultado['status'] = 'ok';
		//$resultado['mensagem'] = $s;
		//$resultado['registro'] = $dados;
		return $s;
	}
	
	exit;
	
    function formata_data($var_data) {
         $var_dia = substr($var_data, 8, 2);
         $var_mes = substr($var_data, 5, 2);
         $var_ano = substr($var_data, 0, 4);
         $data_formatada = "$var_dia";
         $data_formatada.= "/"; 
         $data_formatada.= "$var_mes";
         $data_formatada.= "/";
         $data_formatada.= "$var_ano";
         return $data_formatada;
    }
		
    function formata_data_bd($var_data) {
         $var_dia = substr($var_data, 0, 2);
         $var_mes = substr($var_data, 3, 2);
         $var_ano = substr($var_data, 6, 4);
         $data_formatada = "$var_ano";
         $data_formatada.= "-"; 
         $data_formatada.= "$var_mes";
         $data_formatada.= "-";
         $data_formatada.= "$var_dia";
         return $data_formatada;
    }
?>