import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface SelectPickerProps {
  items: any[],
  placeholder: string,
  onValueChange?: any
  onItemChange?: any
  multiple?: boolean
}

const SelectPicker = (props: SelectPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (item) =>{
    props.onItemChange(item);
    setItems(item);
  }

  console.log('loading', loading)

  return (
    <>
    <DropDownPicker
      loading={loading}
      mode={props.multiple ? "BADGE" : "SIMPLE"}
      extendableBadgeContainer={props.multiple ? true : false}
      multiple={props.multiple ?? false}
      searchable={true}
      open={open}
      value={value}
      items={props.items}
      setOpen={setOpen}
      onOpen={()=>setLoading(true)}
      setValue={setValue}
      dropDownDirection="AUTO"
      bottomOffset={100} 
      //onChangeValue={value=>console.log('value', value)}
      onSelectItem={item=>props.multiple ? handleItemChange(item) : props.onValueChange(item.value)}
      setItems={setItems}
      placeholder={props.placeholder}
      containerProps={{
        height: open ? 250+(items.length*30) : null,
        backgroundColor: "#fff",
        borderColor: "#d6d3d1",
      }}
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