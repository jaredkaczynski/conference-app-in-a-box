'use strict';


export default class Domerate {
    constructor() {
    }

    generate( desc ) {
        let onGenerate = null;
        // Check to see if this should literally just be a text node
        if( 'text' in desc && !('tag' in desc) ) {
            return document.createTextNode( desc.text );
        }
        let r = document.createElement(desc.tag);
        if( 'id' in desc ) {
            r.id = desc.id;
        }
        if( 'for' in desc ) {
            r.htmlFor = desc.for;
        }
        if( 'type' in desc ) {
            r.type = desc.type;
        }
        if( 'class' in desc ) {
            r.className = desc.class;
        }
        if( 'href' in desc ) {
            r.href = desc.href;
        }
        if( 'target' in desc ) {
            r.target = desc.target;
        }
        if( 'text' in desc ) {
            r.appendChild( document.createTextNode( desc.text ) );
        } else if( 'html' in desc ) {
            r.innerHTML = desc.html;
        }
        if( 'value' in desc ) {
            r.value = desc.value;
        }
        if( 'style' in desc ) {
            for( let prop in desc.style ) {
                r.style[prop] = desc.style[prop];
            }
        }
        if( 'children' in desc ) {
            if( typeof desc.children == 'function' ) {
                // Hopefully we got a generator, let's use it to generate
                // the list that we would normally expect here.

                if( 'args' in desc ) {
                    this.addChildrenList( r, desc.children(...desc.args) );
                } else {
                    this.addChildrenList( r, desc.children() );
                }
            } else if( typeof desc.children == 'object' ){
                // At this point we're not sure this is an array yet.
                if( Array.isArray( desc.children ) ) {
                    // It is, just iterate over it.
                    this.addChildrenList( r, desc.children );
                } else {
                    // It's an object, box it in an array, then run.
                    this.addChildrenList( r, [desc.children] );
                }
            }
        }
        if( 'src' in desc ) {
            r.src = desc.src;
        }
        if( 'size' in desc ) {
            r.size = desc.size;
        }
        if( 'colspan' in desc ) {
            r.colSpan = desc.colspan;
        }
        if( 'rowspan' in desc ) {
            r.rowSpan = desc.rowspan;
        }
        if( 'rows' in desc ) {
            r.rows = desc.rows;
        }
        if( 'cols' in desc ) {
            r.cols = desc.cols;
        }
        if( 'selected' in desc && desc.selected == true ) {
            r.selected = 'selected';
        }
        for( let key in desc ) {
            if( key.startsWith('on') ) {
                let eventName = key.substring(2).toLowerCase();
                switch( eventName ) {
                    case 'generate':
                        onGenerate = desc[key];
                        break;

                    default:
                        r.addEventListener(
                            eventName,
                            desc[key]
                        );
                        break;
                }
            }
        }
        if( 'binding' in desc ) {
            let destProperty = null;
            let options = {};
            if( 'destProperty' in desc.binding ) {
                destProperty = desc.binding.destProperty;
            }
            if( 'translateSrcToDest' in desc.binding ) {
                options.translateSrcToDest = desc.binding.translateSrcToDest;
            }
            // r.binding = new Binding(
            //     desc.binding.observe,
            //     desc.binding.property,
            //     r,
            //     destProperty,
            //     options
            // );
        }

        if( onGenerate !== null ) {
            onGenerate( r );
        }
        return r;
    }

    addChildrenList( r, children ) {
        for( let child of children ) {
            // Let's see if it's a child array, we'll flatten child arrays as
            // though they were just a part of the same array for processing.
            if( Array.isArray( child ) ) {
                this.addChildrenList( r, child );
            } else {
                r.appendChild( this.generate( child ) );
            }
        }
    }
};