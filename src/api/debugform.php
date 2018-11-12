<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Zeta Ret Zetadmin Debug Form</title>
<style type="text/css">
form field {
	display: block;
	margin: 10px;
}

form label {
	display: inline-block;
	min-width: 100px;
	width: 10%;
	background: #f5f5f5;
	height: 20px;
	vertical-align: top;
	padding-left: 4px;
}

form input, form textarea, form select {
	display: inline-block;
	min-width: 200px;
	width: 50%;
	padding: 0;
	border: none;
	background: #dadada;
	padding: 0;
	vertical-align: top;
}

form input {
	height: 20px;
}

form textarea {
	resize: none;
	height: 80px;
}

form select {
	height: 20px;
}

#templates {
	display: none;
}
</style>
<script src="/api/js/debugform.js?r=<?php echo(time());?>" async></script>
</head>
<body onload="onInitBody()">
	<h1>Debug Request</h1>
	<form id="debugrequest" action="/api/debugView/json/zetaret/" method="post" onsubmit="return debugRequestForm()">
		<field> <label>command</label> <select class="commandsel" name="command">
			<option value="debugView">debugView</option>
		</select> </field>
		<div class="custom-fields"></div>
		<field>
		<button type="button" onclick="AddCustomField()">Add Custom Field</button>
		<button type="button" onclick="AutofillFields()">Autofill Fields</button>
		<button type="button" onclick="ClearCustomFields()">Clear Fields</button>
		</field>
		<field>
		<button type="submit">Submit</button>
		<button type="button" onclick="ResetDebug()">Reset</button>
		</field>
	</form>
	<h1>Debug View</h1>
	<form id="debugview" method="get">
		<field> <label>uuid</label> <input type="text" name="user" /></field>
		<field> <label>session</label> <input type="text" name="session" /></field>
		<field> <label>cookie</label> <textarea name="cookie"></textarea></field>
		<field> <label>vars</label> <textarea name="vars"></textarea></field>
		<field> <label>commands</label> <select name="commands"></select></field>
		<field> <label>user_data</label> <textarea name="user_data"></textarea></field>
	</form>
	<h1>Debug Response</h1>
	<form id="debugresponse" method="get">
		<field> <label>command</label> <input type="text" name="command" /></field>
		<field> <label>request_data</label> <textarea name="request_data"></textarea></field>
		<field> <label>response_data</label> <textarea name="response_data"></textarea></field>
	</form>
	<div id="templates">
		<field class="template" tid="custom-field"> <label class="cf-label">custom</label> <input type="text" name="custom" class="cf-input" />
		<button type="button" class="cf-button">Remove</button>
		</field>
	</div>
</body>
</html>
