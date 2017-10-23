/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

document.addEventListener(window.WebComponents && !window.WebComponents.ready ? 'WebComponentsReady' : 'DOMContentLoaded', function () {
/**
 * The <code>context-style</code> custom element polyfills CSS <code>@context</code> rules.
 */
class ContextStyle extends HTMLElement {

    constructor() {
        super();
        this._arrayOfQueries = [];
        this._host = document.querySelector("html");
        this._head = document.querySelector('head');
        this._contextQueryObjectList = [];
    }

    connectedCallback() {
        this.style.display = 'none';
        if(this.parentNode.host != undefined) {
            if(!this.parentNode.host.shadowRoot.querySelector('slot')) {
                this._host = this.parentNode.host;
                this._head = this._host.shadowRoot;
            }
        }
        this.getHrefAttr();
    }

    disconnectedCallback() {
        for(let i in this._contextQueryObjectList) {
            if(this._contextQueryObjectList[i]._intervalID != undefined) {
                clearInterval(this._contextQueryObjectList[i]._intervalID);
            }
            this._contextQueryObjectList[i] = null;
            delete this._contextQueryObjectList[i];
        }
        for(let j of this._arrayOfQueries) {
            this._host.classList.remove(j.class);
        }
        this._contextQueryObjectList.length = 0;
    }

    /**
     * @param {string} attr - the query from the "context" attribute   
     */
    getContent(attr) {
        let inner = this.innerHTML;  
        if(inner.trim() != ''){
            inner = inner.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            this.instantiateContextQueryObjects( inner.trim(), attr );
        } else {
            console.error('Context-Styles have not been declared, please use the href attribute or write them directly in the context-style tag.');
        }
                
    }

    getHrefAttr() {
        let attr = false;
        if(this.hasAttribute('context') && this.getAttribute('context') != "") {
            attr = this.getAttribute('context'); 
        } 
        if(this.hasAttribute('href') && this.getAttribute('href') != "") {
            this.getURL(this.getAttribute('href')).then((response) => {
                this.instantiateContextQueryObjects(response, attr);
            }, (error) => {
                console.error("Failed!", error);
            });
        } else {
            this.getContent(attr);
        }   
    }

    /**   
     * @param {string} url - the link to an external context query sheet
     */

    getURL(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function() {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function() {
                reject(Error("Network Error"));
            };
            req.send();
        });
    }
    
    /**
     * @param {string} str the styles found inside the <context-style> custom element
     * @param {string} attr the query of the "context" attribute 
     */

    instantiateContextQueryObjects(str,attr) {
        this.factoriseContextQueries(str,attr);
        for(let contextQuery of this._arrayOfQueries) {
            // Generate unique class;
            const cssClass = 'css-ctx-queries-' + Math.round(Math.random() * new Date).toString(16);
            contextQuery.class = cssClass;
            // Instantiate Object with new constructor
            let cqo = window.matchContext(contextQuery.expression), css = "";
            cqo.onchange = (e) => {
                if(e != undefined) {
                    console.log(e);
                }
                if( cqo.matches ) {
                    if(!this._host.classList.contains(cssClass)){                   
                        this._host.classList.add(cssClass);
                    }       
                } else  {
                    if(this._host.classList.contains(cssClass)) {         
                        this._host.classList.remove(cssClass);
                    }             
                }
            }
            cqo.onchange();

            this._contextQueryObjectList.push(cqo);
            
            for(let style of contextQuery.styles) {
                let key = style.selector;
                if(this._host.shadowRoot != undefined) {
                    if(!this._host.shadowRoot.querySelector('slot')) {
                        if(key == ':host') {
                            css += ':host(.' + cssClass + ') ' + '{' + style.properties + '}'; 
                        } else {
                            css += ':host(.' + cssClass + ') ' + key.replace('&gt;','>') + '{' + style.properties + '}';                            
                        }
                    } else {
                        css += '.' + cssClass + ' ' + this._host.localName + ' ' + key.replace('&gt;','>') + '{' + style.properties + '}'; 
                    }
                } else {
                    if(key === 'html') {
                        css += key +  '.' + cssClass + '{' + style.properties + '}';
                    } else {
                        css += '.' + cssClass + ' ' + key.replace('&gt;','>') + '{' + style.properties + '}';
                    }
                }  
            }
            
            if(this._head.querySelector('#cssCtxQueriesStyleTag')) {
                this._head.querySelector('#cssCtxQueriesStyleTag').appendChild(document.createTextNode(css));
            } else {
                let style = document.createElement('style');
                style.id = 'cssCtxQueriesStyleTag';
                style.appendChild(document.createTextNode(css));
                this._head.appendChild(style);
            }
        }
    }

    /**
     * @param {string} brackets the type of brackets as pair [],{},()
     * @param {string} str the string where the brackets are to be found 
     */

    findClosingBracket(brackets, str){
        let c = str.indexOf(brackets[0], str.indexOf('@context'));
        let i = 1;
        while (i > 0) {
            let b = str[++c];
            if (b == brackets[0]) {
                i++;
            }
            else if (b == brackets[1]) {
                i--;
            }
        }
        return c;
    }

    /**
     * @param {string} str - the content of the <context-style> custom element
     * @param {string} attr - the content of the context attribute, false if the context attribute is empty
     */

    factoriseContextQueries(str, attr) { 
        if(str.includes('@context')){
            let sbstrng = str.substring(str.indexOf("@context"), this.findClosingBracket('{}',str) + 1);
            let str2 = str.replace(sbstrng,'');
            str2 = str2.trim();
            this._arrayOfQueries.push(sbstrng);
            this.factoriseContextQueries(str2, attr);
        } else {
            // push the query from the context attribute into _arrayOfQueries
            if(attr != false) {
                this._arrayOfQueries.push('@context '+ attr +' {'+ str + '}');
            }
            let newArrayOfQueries = [];
            for (let elm of this._arrayOfQueries) {
                let expression = elm.substring(8, elm.indexOf('{'));
                let styles = elm.substring(elm.indexOf('{') + 1,elm.lastIndexOf('}'));
                let arrayOfSelectors = [], singleStyles = styles.split(/\s*}\s*/);
                for (let z of singleStyles){
                    let classes, attrs, classArr; 
                    classes = z.substring(0,z.indexOf("{"));
                    attrs =  z.substring(z.indexOf("{") + 1);                            
                    classArr = classes.split(/\s*,\s*/);
                    for(let sc of classArr) {
                        let obj = { selector: sc.trim(), properties: attrs.trim() };
                        if(obj.selector != "" || obj.properties !== "") {
                            arrayOfSelectors.push(obj);
                        }
                    }
                }
                
                newArrayOfQueries.push({expression:expression.trim(),styles:arrayOfSelectors});  
            }
            
            // factorise all objects in _arrayOfQueries only if there's a global query and more than one query in total 
            if(attr != false) {
                let globalQuery = newArrayOfQueries[newArrayOfQueries.length - 1].expression;
                for(let i = 0; i < newArrayOfQueries.length - 1; i++) {
                    newArrayOfQueries[i].expression += ' and ' + globalQuery;
                }
            }
            this._arrayOfQueries = [];
            // reorganise arrayOfQueries
            for (let i of newArrayOfQueries) {
                if(i.styles.length > 0) {
                    this._arrayOfQueries.push(i);
                }
            }
        }      
    }
    
}

window.customElements.define('context-style', ContextStyle);
});
