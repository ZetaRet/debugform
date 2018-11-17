/**
 * Author: Zeta Ret
 * Zeta Ret Debug Form
 * Zetadmin API Debug Form
 * Version: 1.03
 * Date: 2018 - Today
 **/

/**
 * Register Custom HTML Elements by using HTMLUnknownElement
 */
HTMLDocument.prototype.__zetaElements = {};
HTMLDocument.prototype.registerZetaElement = function(name) {
	this.getElementsByTagName(name).constructZetaElement(name);
	this.__zetaElements[name] = {};
	return this;
};
HTMLDocument.prototype.observeZetaElements = function() {
	var doc = this, observer = new MutationObserver(function(mutations) {
		var l = mutations.length, i, an;
		for (i = 0; i < l; i++) {
			an = mutations[i].addedNodes;
			if (an && an.length > 0)
				doc.constructZetaElements(an);
		}
	});
	observer.observe(this.body, {
		childList: true,
		subtree: true
	});
	return observer;
};
HTMLDocument.prototype.constructZetaElements = function(list) {
	var zel = this.__zetaElements, name, un, j, el, anl = list.length;
	for (j = 0; j < anl; j++) {
		el = list[j];
		un = el.tagName;
		name = un ? un.toLowerCase() : null;
		if (zel[name] && el.constructor === HTMLUnknownElement) {
			el[un + "_constructor"](name);
			Object.setPrototypeOf(el, HTMLElement.prototype)
		}
	}
	return this;
};
HTMLCollection.prototype.constructZetaElement = function(name, list) {
	if (!list)
		list = this;
	var un = name.toUpperCase(), l = list.length, i, el;
	for (i = 0; i < l; i++) {
		el = list[i];
		if (el.tagName === un && el.constructor === HTMLUnknownElement) {
			el[un + "_constructor"](name);
			Object.setPrototypeOf(el, HTMLElement.prototype)
		}
	}
	return this;
};

/**
 * Custom constructors per TAG name
 */
HTMLUnknownElement.prototype.FIELD_constructor = function(name) {
	this.setAttribute("zeta-element", name);
};

/**
 * Global Config
 */
var G = {
	ajax: {
		base: "/api/",
		format: "json",
		api: "zetaret"
	},
	__templates: {},
	dt: {
		mpfd: "multipart/form-data",
		ajs: "application/json",
		afue: "application/x-www-form-urlencoded"
	}
};

function urlParam(obj) {
	var es = '', p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			if (es.length > 0)
				es += '&';
			es += encodeURI(p + '=' + obj[p]);
		}
	}
	return es;
}

function request(p) {
	var m = p.method || 'POST';
	var d = p.data || {};
	var u = p.url;
	var dt = p.type || (m === 'GET' ? 'url' : 'json');
	var ct = p.contentType || G.dt.ajs;
	var pd = p.processData !== undefined ? p.processData : true;
	var rt = p.responseType || 'json';
	var sd = d;
	var h = p.headers;
	var key;
	var a = p.async !== undefined ? p.async : true;

	if (dt == 'form') {
		if (pd) {
			sd = new FormData();
			for (key in d)
				sd.append(key, d[key]);
		}
		if (ct === true)
			ct = G.dt.mpfd;
	} else if (dt == 'file') {
		if (ct === true)
			ct = sd.type;
	} else if (dt == 'json') {
		if (pd)
			sd = JSON.stringify(d);
		if (ct === true)
			ct = G.dt.ajs;
	} else {
		if (pd)
			sd = urlParam(d);
		if (ct === true)
			ct = G.dt.afue;
		if (m === 'GET' && pd) {
			u += '?' + sd;
		}
	}
	if (m === 'GET')
		sd = null;

	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		if (p.response)
			p.response(xhr.responseText, xhr.status);
		if (xhr.status === 200) {
			if (p.complete) {
				var responseData = xhr.responseText;
				if (rt == 'json')
					responseData = JSON.parse(responseData);
				p.complete(responseData);
			}
		} else if (p.fail) {
			p.fail(xhr.responseText, xhr.status);
		}
	};
	xhr.onerror = function() {
		if (p.error)
			p.error();
	};
	xhr.open(m, u, a);
	if (ct != G.dt.mpfd)
		xhr.setRequestHeader('Content-Type', ct);
	if (h) {
		for (key in h)
			xhr.setRequestHeader(key, h[key]);
	}
	xhr.send(sd);
	return xhr;
}

function getFormData(f) {
	var fd = {}, c, i;
	c = f.getElementsByTagName('select');
	for (i = 0; i < c.length; i++) {
		fd[c[i].name] = c[i].value;
	}
	c = f.getElementsByTagName('input');
	for (i = 0; i < c.length; i++) {
		fd[c[i].name] = c[i].value;
	}
	c = f.getElementsByTagName('textarea');
	for (i = 0; i < c.length; i++) {
		fd[c[i].name] = c[i].innerText;
	}
	return fd;
}

function setFormData(f, fd) {
	var c, i, j, ar, ov, cv;
	f.__formData = fd;
	c = f.getElementsByTagName('select');
	for (i = 0; i < c.length; i++) {
		ar = fd ? fd[c[i].name] : [];
		ov = c[i].value;
		c[i].innerHTML = "";
		for (j = 0; j < ar.length; j++) {
			var opt = document.createElement('option');
			cv = ar[j];
			opt.value = cv;
			opt.innerHTML = cv;
			if (ov == cv)
				opt.setAttribute("selected", "1");
			c[i].appendChild(opt);
		}
	}
	c = f.getElementsByTagName('input');
	for (i = 0; i < c.length; i++) {
		c[i].value = fd ? fd[c[i].name] : "";
	}
	c = f.getElementsByTagName('textarea');
	for (i = 0; i < c.length; i++) {
		c[i].innerText = fd ? JSON.stringify(fd[c[i].name]) : "";
	}
	return fd;
}

function debugRequestForm() {
	var drf = document.getElementById("debugrequest");
	var fd = getFormData(drf);
	request({
		url: G.ajax.base + fd.command + '/' + G.ajax.format + '/' + G.ajax.api + '/',
		method: fd.method,
		data: fd,
		complete: function(rd) {
			debugResponseData(fd, rd);
			if (fd.command == "debugView")
				viewDebugData(rd);
		}
	});
	return false;
}

function viewDebugData(rd) {
	console.log(rd);
	setFormData(document.getElementById("debugview"), rd);
	setFormData(document.getElementById("debugrequest"), {
		command: rd.commands,
		command_data: rd.command_data,
		method: ["POST", "GET"]
	});
}

function debugResponseData(fd, rd) {
	console.log(fd, rd);
	setFormData(document.getElementById("debugresponse"), {
		command: fd.command,
		request_data: fd,
		response_data: rd
	});
}

function AddCustomField(ftn) {
	var ft = getTemplate("custom-field");
	var dvf = document.getElementById("debugrequest");
	var cf = dvf.getElementsByClassName('custom-fields')[0];
	if (!ftn)
		ftn = window.prompt("Enter field name", "");
	ft.getElementsByClassName("cf-label")[0].innerText = ftn;
	ft.getElementsByClassName("cf-input")[0].setAttribute("name", ftn);
	ft.getElementsByClassName("cf-button")[0].addEventListener("click", function(e) {
		ft.remove();
	});
	cf.appendChild(ft);
}

function ClearCustomFields() {
	var dvf = document.getElementById("debugrequest");
	var cf = dvf.getElementsByClassName('custom-fields')[0];
	cf.innerHTML = "";
}

function AutofillFields() {
	var drf = document.getElementById("debugrequest");
	var cs = drf.getElementsByClassName("commandsel")[0];
	ClearCustomFields();
	autoSetDebugRequestFields(cs.value);
}

function initTemplates() {
	var t = document.getElementById("templates"), ts = t.getElementsByClassName("template"), i, td, tid;
	for (i = 0; i < ts.length; i++) {
		td = ts[i];
		tid = td.getAttribute("tid");
		td.classList.remove("template");
		td.classList.add(tid);
		G.__templates[tid] = td;
	}
	t.parentNode.removeChild(t);
}

function getTemplate(id) {
	if (G.__templates[id]) {
		return G.__templates[id].cloneNode(true);
	}
	return null;
}

function autoSetDebugRequestFields(v) {
	var drf = document.getElementById("debugrequest"), drfdv = drf.__formData && drf.__formData.command_data ? drf.__formData.command_data[v] : false, i;
	if (drfdv && drfdv.fields) {
		for (i = 0; i < drfdv.fields.length; i++) {
			AddCustomField(drfdv.fields[i]);
		}
	}
}

function initDebugRequestForm() {
	var drf = document.getElementById("debugrequest");
	var cs = drf.getElementsByClassName("commandsel")[0];
	cs.addEventListener("change", function(e) {
		ClearCustomFields();
		autoSetDebugRequestFields(cs.value);
	});
}

function ResetDebug() {
	ClearCustomFields();
	setFormData(document.getElementById("debugrequest"), {
		command: ["debugView"],
		method: ["POST", "GET"]
	});
	setFormData(document.getElementById("debugview"), null);
	setFormData(document.getElementById("debugresponse"), null);
}

function onInitBody() {
	initTemplates();
	document.registerZetaElement('field').observeZetaElements();
	initDebugRequestForm();
	console.log('init body');
}
