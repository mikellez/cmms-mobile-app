import { background } from "native-base/lib/typescript/theme/styled-system";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface SelectPickerProps {
  items: any[],
  placeholder: string,
  onValueChange?: any
  onItemChange?: any
  multiple?: boolean,
  selectedValue?: any,
  disabled: boolean
}

const SelectPicker = (props: SelectPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (item) =>{
    console.log('item', item);
    props.onItemChange(item.map(i=>i.value));
    //setItems(item.map(i=>i.value));
    //setValue(item);
  }

  useEffect(() => {
    if(!props.multiple && props.selectedValue){
      props.onValueChange(props.selectedValue);
    }
  }, [])

  return (
    <>
    <DropDownPicker
      disabled={props.disabled}
      disabledStyle={{
        opacity: 0.5,
        backgroundColor: "#f5f5f5"
      }}
      loading={loading}
      mode={props.multiple ? "BADGE" : "SIMPLE"}
      extendableBadgeContainer={props.multiple ? true : false}
      multiple={props.multiple ?? false}
      searchable={true}
      open={open}
      value={props.selectedValue}
      items={props.items}
      setOpen={setOpen}
      onOpen={()=>setLoading(true)}
      setValue={setValue}
      dropDownDirection="AUTO"
      bottomOffset={100} 
      //onChangeValue={value=>props.onValueChange(value)}
      onSelectItem={item=>props.multiple ? handleItemChange(item) : props.onValueChange(item.value)}
      setItems={setItems}
      placeholder={props.placeholder}
      /*containerProps={{
        height: open ? 250+(items.length*30) : null,
        backgroundColor: "#fff",
        borderColor: "#d6d3d1",
      }}*/
      style={{
        borderColor: "#d6d3d1",
      }}
      dropDownContainerStyle={{
        borderColor: "#d6d3d1",
      }}
      searchContainerStyle={{
        borderBottomColor: "#d6d3d1",
      }}
      searchTextInputStyle={{
        borderColor: "#d6d3d1",
      }}
      placeholderStyle={{
        color: "#a3a3a3",
        fontSize: 12,
      }}
      listMode="MODAL"
    />
    </>
  )
}

export default SelectPicker;