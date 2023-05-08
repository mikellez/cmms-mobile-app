import { FormControl, HStack, Radio, Select, CheckIcon, TextArea, Pressable, Button, Box, Text } from "native-base";
import { FlatList } from "react-native";
import ImagePreview from "../ImagePreview";
import ImageComponent from "../Image";

const FormGroup = ({
  action,
  plant,
  asset,
  requestItems,
  requestTypes,
  onRequestTypeChange,
  faultTypes,
  onFaultTypeChange,
  onFaultDescriptionChange,
  plants,
  onPlantLocationChange,
  assetTags,
  onAssetTagChange,
  imageSource,
  onImagePicker,
  prioritySelected,
  priorities,
  onPriorityChange,
  assignUserSelected,
  assignUsers,
  onAssignUserChange,
  completionImageSource,
  onCompletionImagePicker,
  onCompletionCommentChange,
  onSubmit,
  onStatusAction,
  onRejectionCommentChange,
  onNameChange
}) => {
  const data = [
    {
      id: 0,
      isRequried: true,
      type: "textarea",
      label: "Guest Name",
      placeholder: "Guest Name",
      accessibilityLabel: "Guest Name",
      onChangeText: onNameChange,
      show: action === "create" && (plant || false)
    },
    {
      id: 1, 
      isRequried: true,
      type:"radio", 
      label: "Request Type", 
      accessibilityLabel: "Pick a type", 
      name:"request_type", 
      defaultValue: "1", 
      onChange: onRequestTypeChange, 
      value: (requestItems?.req_id ?? ''), 
      items: requestTypes, 
      itemsConfig: { key: "req_id", value: "req_id", label: "request", isDisabled: action !== "create" ?? false},
      selectedValueCond: (action !== 'create' && { value: requestItems?.req_id ?? ''})
    },
    {
      id: 2, 
      isRequried: true,
      type: "select", 
      label: "Fault Type", 
      accessibilityLabel: "Fault Type", 
      placeholder: "Choose Fault Type", 
      onValueChange: onFaultTypeChange, 
      isDisabled: action !== "create" ?? false, 
      selectedValue: requestItems?.fault_id || '', 
      items: faultTypes,
      itemsConfig: { key: "fault_id", value: "fault_id", label: "fault_type"},
      selectedValueCond: (action !== 'create' && { value: requestItems?.fault_id ?? ''})
    },
    {
      id: 3,
      isRequried: true,
      type: "textarea",
      label: "Fault Description",
      placeholder: "Fault Description",
      accessibilityLabel: "Fault Description",
      name: "fault_description",
      defaultValue: requestItems?.description || '',
      onChangeText: onFaultDescriptionChange,
      isDisabled: action !== "create" ?? false,
      isReadOnly: action !== "create" ?? false,
      valueCond: (action !== 'create' && { value: requestItems?.description || 'NIL'})
    },
    {
      id: 4, 
      isRequried: true,
      type: "select", 
      label: "Plant Location",
      accessibilityLabel: "Plant Location",
      placeholder: "Choose Plant Location", 
      onValueChange: onPlantLocationChange, 
      isDisabled: (action !== "create" || (action === 'create' && plant)) ?? false,
      items: faultTypes,
      itemsConfig: { key: "fault_id", value: "fault_id", label: "fault_type"},
      selectedValueCond: ((action !== 'create' || (action === 'create' && plant)) && { selectedValue: plant ? plant : (requestItems?.plant_id || '')})
    },
    {
      id: 5,
      isRequried: true,
      type: "select",
      label: "Asset Tag",
      accessibilityLabel: "Asset Tag",
      placeholder: "Choose Asset Tag",
      onValueChange: onAssetTagChange,
      isDisabled: (action !== "create" || (action === 'create' && asset)) ?? false,
      items: assetTags,
      itemsConfig: { key: "psa_id", value: "psa_id", label: "asset_name" },
      selectedValueCond: ((action !== 'create' || (action === 'create' && asset)) && { selectedValue: asset ? asset : (requestItems?.psa_id || '')})
    },
    {
      id: 6,
      isRequried: true,
      type: "image",
      label: "Image",
      accessibilityLabel: "Image",
      name: "image",
      defaultValue: requestItems?.image || '',
      onPress: onImagePicker,
      isDisabled: action !== "create" ?? false,
      value: requestItems?.image || '',
      imageSource: imageSource,
      bufferData: requestItems?.uploaded_file.data
    },
    {
      id: 8,
      isRequried: true,
      type: "select",
      label: "Assign To",
      accessibilityLabel: "Assign To",
      placeholder: "Choose Assign To",
      onValueChange: onAssignUserChange,
      isDisabled: action !== "create" ?? false,
      items: assignUsers,
      itemsConfig: { key: "id", value: "id", label: "detail" },
      selectedValue: assignUserSelected?.value ? assignUserSelected?.value : requestItems?.assigned_user_id,
      show: action === 'assign'
    },
    {
      id: 9,
      isRequried: true,
      type: "select",
      label: "Priority",
      accessibilityLabel: "Priority",
      placeholder: "Choose Priority",
      onValueChange: onPriorityChange,
      isDisabled: action !== "create" ?? false,
      items: priorities,
      itemsConfig: { key: "priority_id", value: "priority_id", label: "priority" },
      selectedValueCond: (action !== 'create' && { value: requestItems?.priority_id ?? ''}),
      show: action === 'assign'
    },
    {
      id: 10,
      isRequired: true,
      type: "image",
      label: "Completion Image",
      onPress: onCompletionImagePicker,
      imageSource: completionImageSource,
      bufferData: [],//requestItems?.completion_file?.data,
      show: ['complete','manage'].includes(action)
    },
    {
      id: 11,
      isRequired: true,
      type: "textarea",
      label: "Completion Comment",
      placeholder: "Completion Comment",
      defaultValue: requestItems?.completion_comment || '',
      onChangeText: onCompletionCommentChange,
      isDisabled: action === "manage",
      isReadOnly: action === "manage",
      valueCond: (action !== 'complete' && { value: requestItems?.completion_comments || 'NIL'}),
      show: ['complete','manage'].includes(action)
    },
    {
      id: 12,
      isRequired: true,
      type: "textarea",
      label: "Comments",
      placeholder: "Comments",
      onChangeText: onRejectionCommentChange,
      show: action === 'manage'
    },
    {
      id: 13,
      isRequired: true,
      type: "buttongroup",
      items: [{
        label: 'Approve',
        onPress: ()=>onStatusAction(4),
        bgColor: 'rgb(14, 189, 5)',
      },{
        label: 'Reject',
        onPress: ()=>onStatusAction(5),
        bgColor: '#C8102E'
      }],
      show: action === 'manage'
    },
    {
      id: 14,
      isRequired: true,
      type: "button",
      label: "Submit",
      bgColor: "#C8102E",
      show: action !== 'manage',
      onPress: onSubmit
    }

  ]
  return (
    <>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={(item)=>{
        const { 
          type, 
          label, 
          accessibilityLabel, 
          name, 
          defaultValue, 
          onChange, 
          value, 
          items, 
          itemsConfig, 
          placeholder, 
          onValueChange, 
          isDisabled,
          selectedValue,
          onChangeText,
          selectedValueCond,
          bufferData,
          onPress,
          show = true,
          valueCond,
          bgColor
        } = item.item;
      
        switch(type) {
          case "radio":
            return ( 
              <FormControl isRequired>
                <FormControl.Label>{label}</FormControl.Label>
                <Radio.Group
                  name={name}
                  defaultValue={defaultValue}
                  accessibilityLabel={accessibilityLabel}
                  onChange={onChange}
                  {...(action !== 'create' && { value: value})}
                  >

                  <HStack flex={1} justifyContent="space-between" w="100%" flexWrap={'wrap'}>
                    {items.map((item) => (
                      <Radio key={item[itemsConfig.key]} value={item[itemsConfig.value]} colorScheme="red" size="sm" my={1} isDisabled={itemsConfig.isDisabled}>{item[itemsConfig.label]}</Radio>
                    ))}

                  </HStack>
                </Radio.Group>
              </FormControl>
            );
            break;

          case "select":
            return ( 
              <>
              { show && 
                <FormControl isRequired>
                  <FormControl.Label>{ label }</FormControl.Label>
                  <Select
                    accessibilityLabel={accessibilityLabel}
                    placeholder={placeholder}
                    _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
                    mt="1"
                    onValueChange={onValueChange}
                    isDisabled={isDisabled}
                    {...selectedValueCond}
                    >

                    {items.map((item) => {
                      return (<Select.Item key={item[itemsConfig.key]} label={item[itemsConfig.label]} value={item[itemsConfig.value]} />)
                    })}

                  </Select>
                </FormControl>
              }
              </>
            );
            break;

        case "textarea":
          return (
            <>
            { show &&
            <FormControl isRequired>
              <FormControl.Label>{label}</FormControl.Label>
              <TextArea 
                placeholder={placeholder}
                autoCompleteType={true} 
                onChangeText={onChangeText} 
                isDisabled={action !== "create" ?? false} 
                isReadOnly={action !== "create" ?? false}
                _disabled={{
                  bg: "muted.100",
                }}
                {...valueCond}
                />
            </FormControl>
            }
            </>
          );
          break;

        case "image":
          return (
            <>
            { show && <FormControl isRequired>
              <FormControl.Label>{label}</FormControl.Label>
              { bufferData 
                ? <ImageComponent bufferData={bufferData}/> 
                : 
                <Pressable onPress={onPress}>
                  <ImagePreview source={{ uri: imageSource }} alt="test" />
                </Pressable>
              }
            </FormControl>
            }
            </>
          );
          break;

        case "buttongroup":
          return (
            <>
            { show && 
              <HStack justifyContent="center">
                <Button bgColor={items[0].bgColor} mr={5} mt={5} mb={10} onPress={items[0].onPress}>{ items[0].label }</Button>
                <Button bgColor={items[1].bgColor} ml={5} mt={5} mb={10} onPress={items[1].onPress}>{ items[1].label }</Button>
              </HStack>
            }
            </>
          );

          break;

        case "button":
          return (
            <>
            { show && <Button bgColor={bgColor} mt={5} mb={10} onPress={onPress}>{ label }</Button>}
            </>
          );
          break;

        }

      }
      }
    />
    {/*<FormControl isRequired>
      <FormControl.Label>Request Type</FormControl.Label>
      <Radio.Group
        name="request_type"
        defaultValue="1"
        accessibilityLabel="pick a size"
        onChange={onRequestTypeChange}
        {...(action !== 'create' && { value: requestItems?.req_id ?? ''})}
        >

        <HStack flex={1} justifyContent="space-between" w="100%" flexWrap={'wrap'}>
          {requestTypes.map((requestType) => (
            <Radio key={requestType.req_id} value={requestType.req_id} colorScheme="red" size="sm" my={1} isDisabled={action !== "create" ?? false}>{requestType.request}</Radio>
          ))}

        </HStack>
      </Radio.Group>
    </FormControl>

    <FormControl isRequired>
        <FormControl.Label>Fault Type</FormControl.Label>
        <Select
          accessibilityLabel="Choose Fault Type"
          placeholder="Choose Fault Type"
          _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
          mt="1"
          onValueChange={onFaultTypeChange}
          isDisabled={action !== "create" ?? false}
          {...(action !== 'create' && { selectedValue: requestItems?.fault_id || ''})}
          >

          {faultTypes.map((faultType) => (
            <Select.Item key={faultType.fault_id} label={faultType.fault_type} value={faultType.fault_id} />
          ))}

        </Select>
      </FormControl>

     {/* <FormControl isRequired>
        <FormControl.Label>Fault Description</FormControl.Label>
        <TextArea 
          placeholder="Fault description" 
          autoCompleteType={true} 
          onChangeText={onFaultDescriptionChange} 
          isDisabled={action !== "create" ?? false} 
          isReadOnly={action !== "create" ?? false}
          _disabled={{
            bg: "muted.100",
          }}
          {...(action !== 'create' && { value: requestItems?.description || 'NIL'})}
          />
      </FormControl>
      
      <FormControl isRequired>
        <FormControl.Label>Plant Location</FormControl.Label>
        <Select
          accessibilityLabel="Choose Plant Location"
          placeholder="Choose Plant Location"
          _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
          mt="1"
          onValueChange={onPlantLocationChange}
          isDisabled={(action !== "create" || (action === 'create' && plant)) ?? false}
          {...((action !== 'create' || (action === 'create' && plant)) && { selectedValue: plant ? plant : (requestItems?.plant_id || '')})}
          >

          {plants.map((plant) => (
            <Select.Item key={plant.plant_id} label={plant.plant_name} value={plant.plant_id} />
          ))}

        </Select>
      </FormControl>
      
      <FormControl isRequired>
        <FormControl.Label>Asset's Tags</FormControl.Label>
        <Select
          accessibilityLabel="Choose Asset Tag"
          placeholder="Choose Asset Tag"
          _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
          mt="1"
          onValueChange={onAssetTagChange}
          isDisabled={(action !== "create" || (action === 'create' && asset)) ?? false}
          {...((action !== 'create' || (action === 'create' && asset)) && { selectedValue: asset ? asset : (requestItems?.psa_id || '')})}
          >

          {assetTags.map((assetTag) => (
            <Select.Item key={assetTag.psa_id} label={assetTag.asset_name} value={assetTag.psa_id} />
          ))}

        </Select>
      </FormControl>
      
      <FormControl isRequired>
        <FormControl.Label>Image</FormControl.Label>
        { requestItems?.uploaded_file?.data 
          ? <ImageComponent bufferData={requestItems?.uploaded_file.data}/> 
          : 
          <Pressable onPress={onImagePicker}>
            <ImagePreview source={{ uri: imageSource }} alt="test" />
          </Pressable>
        }
      </FormControl>

      { action === "assign" &&
      <FormControl isRequired>
        <FormControl.Label>Assign To</FormControl.Label>
        <Select
          accessibilityLabel="Choose Assign To"
          placeholder="Choose Assign To"
          _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
          mt="1"
          onValueChange={onAssignUserChange}
          selectedValue={assignUserSelected?.value ? assignUserSelected?.value : requestItems?.assigned_user_id }
          >

          {assignUsers.map((user) => {
            const name = user.name + ' | ' + user.email;
            return (<Select.Item key={user.id} label={name} value={user.id} />)
          })}

        </Select>
      </FormControl>
      }

      { action === "assign" && 
      <FormControl isRequired>
        <FormControl.Label>Priority</FormControl.Label>
        <Select
          accessibilityLabel="Choose Priority"
          placeholder="Choose Priority"
          _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }}
          mt="1"
          onValueChange={onPriorityChange}
          selectedValue={prioritySelected?.p_id ? prioritySelected?.p_id : requestItems?.priority_id}
          >

          {priorities.map((priority) => (
            <Select.Item key={priority.p_id} label={priority.priority} value={priority.p_id} />
          ))}

        </Select>
      </FormControl>
      }

      { ["complete", "manage"].includes(action) &&
        <FormControl isRequired>
          <FormControl.Label>Completion Image</FormControl.Label>
            { requestItems?.completion_file?.data
              ? <ImageComponent bufferData={requestItems?.completion_file.data}/> 
              : 
              <Pressable onPress={onCompletionImagePicker}>
                <ImagePreview source={{ uri: completionImageSource }} alt="test" />
              </Pressable>
            }
        </FormControl>
      }

      { ["complete", "manage"].includes(action) &&
      <FormControl isRequired>
        <FormControl.Label>Completion Comments</FormControl.Label>
        <TextArea 
          placeholder="Completion Comments" 
          autoCompleteType={true} 
          onChangeText={onCompletionCommentChange} 
          isDisabled={action === "manage"} 
          isReadOnly={action === "manage"}
          _disabled={{
            bg: "muted.100",
          }}
          {...(action !== 'complete' && { value: requestItems?.complete_comments || 'NIL' })}
          />
      </FormControl>
      }

      { action === 'manage' &&
      <FormControl isRequired>
        <FormControl.Label>Comments</FormControl.Label>
        <TextArea 
          placeholder="Comments" 
          autoCompleteType={true} 
          onChangeText={onRejectionCommentChange} 
          />
      </FormControl>
      }

      { action === 'manage' &&
        <HStack justifyContent="center">
          <Button bgColor="rgb(14, 189, 5);" mr={5} mt={5} mb={10} onPress={()=>onStatusAction(4)}>Approve</Button>
          <Button bgColor="#C8102E" ml={5} mt={5} mb={10} onPress={()=>onStatusAction(5)}>Reject</Button>
        </HStack>

      } 

      { action !== 'manage' && <Button bgColor="#C8102E" mt={5} mb={10} onPress={onSubmit}>Submit</Button>}
    */}

    </>

  )

}

export default FormGroup;