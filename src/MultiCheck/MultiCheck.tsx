import './MultiCheck.css';

import React from 'react';
import {FC} from 'react';

export type Option = {
  label: string,
  index?: number,
  value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
  // the label text of the whole component
  label?: string,
  // Assume no duplicated labels or values
  // It may contain any values, so be careful for you "Select All" option
  options: Option[],
  // Always positive integer.
  // The default value is 1
  // 0 is considered as 1
  // We only check [0, 1, 2, ... 10], but it should work for greater number
  columns?: number,
  // If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
  // if not undefined, makes the component in controlled mode with corresponding options checked.
  // Assume no duplicated values.
  // It may contain values not in the options.
  values?: string[]
  // if not undefined, when checked options are changed, they should be passed to outside
  // if undefined, the options can still be selected, but won't notify the outside
  onChange?: (options: Option[]) => void,
}

export const MultiCheck: FC<Props> = (props) => {
    const {options = [],columns=3,values=[],onChange=()=>{}} = props;
    //use 'for' render the checkbox list
    const CheckBoxList = () => {
        let list: Option[] = [{label:'Select All',value:''},...options];
        const listRender =[];
        for (const index in list) {
            const {value,label}=list[index] as Option;
            listRender.push(<span key={ index } className='Col' style={{width:widthMath(columns)}}>
                <input type="checkbox" id={`checkbox${index}`}  checked={isSelectedAll(value)} onChange={()=>{changeHandle(list[index])}}/>
                <label>{label}</label></span>);
        }
        return <div className='CheckList'>{listRender}</div>
    }
    // set the checkbox status
    const isSelectedAll=(val:string)=>{
        const checkArr= options.filter(it=>values.includes(it.value));
        if(val){
          return  values.includes(val)
        }else{
            return  checkArr.length>=options.length
        }
    }
    // if the columns > options length, set auto
    const widthMath=(col:number)=>{
       return col>=options.length?'auto':`${100/col}%`;
    }
    // check the value is selected
    function changeHandle(item?:Option) {
        let selectedList: Option[] = [];
        let unSelectedList: Option[] = [];
        // find selected and unselected
        options.forEach((it) => {
            //find values index
            const index = values.findIndex(fit => fit === it.value);
            const obj = {...it, index};
            index === -1 ? unSelectedList.push(obj) : selectedList.push(obj);
        });
        if(item?.value) {
            // filter the options
            let hasVal=false;
            for (let i = 0; i < selectedList.length; i++) {
                let selectItem = selectedList[i] as Option;
                //Single select
                if (selectItem.value === item.value) {
                    values.splice(Number(selectItem.index), 1);
                    selectedList.splice(i, 1);
                    hasVal=true
                    break;
                }
            }
            if(!hasVal){
                values.push(item.value);
                selectedList.push({...item,index:selectedList.length})
            }
        }else{
            //select all
            const validList = options.filter(it => values.includes(it.value));
            //when add Values the count > options,filter the not in options value
            if (options.length <= validList.length) {
                values.length = 0;
                selectedList=[];
            }else{
                unSelectedList.forEach(unit=>{
                    values.push(unit.value);
                })
                selectedList=selectedList.concat(unSelectedList)
            }
        }
        onChange(selectedList);
    }
    return (<div className='MultiCheck'>
        <CheckBoxList />
    </div>)
}
