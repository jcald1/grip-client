/* eslint-disable no-undef */
import React from 'react';

const Category = ({ items, name, style, active }) => {
    const block = items ? items.map(item => {
        return (<div>{item}</div>)
            
    }) : null;

    const clazz = ( active === false) ? 'nav-text-inactive' : 'nav-text';
    return (<div style={{padding: '5px', ...style}} className={clazz}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ fontSize: '18px', display: 'inline-block', }}>{name}</div>
                    <div className="nav-item" style={{display: 'inline-block', fontSize: '18px', fontWeight: 'bold'}}>+</div>
                </div>
                <div style={{padding: '5px'}}> {block}</div>
            </div>)

}

export default Category;
