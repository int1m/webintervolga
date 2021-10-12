window.loadComponent = ( function() {
    function fetchAndParse( URL ) {
        return fetch( URL ).then( ( response ) => {
            return response.text();
        } ).then( ( html ) => {
            const parser = new DOMParser();
            const document = parser.parseFromString( html, 'text/html' );
            const head = document.head;
            const template = head.querySelector( 'template' );
            const style = head.querySelector( 'style' );
            const script = head.querySelector( 'script' );

            return {
                template,
                style,
                script
            };
        } );
    }

    function registerComponent( { template, style, name } ) {
        class UnityComponent extends HTMLElement {
            connectedCallback() {
                this._upcast();
            }

            _upcast() {
                const shadow = this.attachShadow( { mode: 'open' } );

                shadow.appendChild( style.cloneNode( true ) );
                shadow.appendChild( document.importNode( template.content, true ) );
            }
        }

        return customElements.define( 'hello-world', UnityComponent );
    }

    function loadComponent( URL ) {
        return fetchAndParse( URL ).then( registerComponent );
    }

    return loadComponent;
}() );