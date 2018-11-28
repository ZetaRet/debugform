/**
 * Author: Zeta Ret
 * Zeta Ret Proto HTML
 * Register Custom prototypes of HTML Elements by using HTMLUnknownElement
 * Version: 1.05
 * Date: 2018 - Today
 **/

/**
 * document prototyping
 */
HTMLDocument.prototype.__zetaElements = {};
HTMLDocument.prototype.__zetaObserver = null;
HTMLDocument.prototype.registerZetaElement = function(name, data, protoElement) {
	this.__zetaElements[name] = data || {};
	this.__zetaElements[name].protoElement = protoElement;
	this.getElementsByTagName(name).constructZetaElement(name, null, protoElement);
	return this;
};
HTMLDocument.prototype.registerZetaConstructor = function(name, constructor) {
	HTMLUnknownElement.prototype[name.toUpperCase() + '_constructor'] = constructor;
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
	observer.observe(doc.body, {
		childList: true,
		subtree: true
	});
	doc.__zetaObserver = observer;
	return observer;
};
HTMLDocument.prototype.constructZetaElements = function(list) {
	var zel = this.__zetaElements, name, un, j, el, anl = list.length, protoElement;
	for (j = 0; j < anl; j++) {
		el = list[j];
		un = el.tagName;
		name = un ? un.toLowerCase() : null;
		if (zel[name] && el.constructor === HTMLUnknownElement) {
			el[un + "_constructor"](name);
			protoElement = zel[name].protoElement || HTMLElement;
			Object.setPrototypeOf(el, protoElement.prototype)
		}
	}
	return this;
};
HTMLDocument.prototype.registerZetaElementMap = function(map) {
	var doc = this, k, v;
	for (k in map) {
		v = map[k];
		doc.registerZetaConstructor(k, v.protoConstructor);
		doc.registerZetaElement(k, v, v.protoElement);
	}
	if (!doc.__zetaObserver)
		doc.observeZetaElements();
};

/**
 * HTMLCollection prototyping
 */
HTMLCollection.prototype.constructZetaElement = function(name, list, protoElement) {
	if (!list)
		list = this;
	var un = name.toUpperCase(), l = list.length, i, el;
	if (!protoElement)
		protoElement = HTMLElement;
	for (i = 0; i < l; i++) {
		el = list[i];
		if (el.tagName === un && el.constructor === HTMLUnknownElement) {
			el[un + "_constructor"](name);
			Object.setPrototypeOf(el, protoElement.prototype)
		}
	}
	return this;
};
