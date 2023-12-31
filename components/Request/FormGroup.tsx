import { FormControl, HStack, Radio, Select, CheckIcon, TextArea, Pressable, Button, Box, Text } from "native-base";
import { FlatList, View } from "react-native";
import ImagePreview from "../ImagePreview";
import ImageComponent from "../Image";
import { useEffect, useState } from "react";

import { isEmpty } from "../../helper/utility";
import instance from "../../axios.config";
import { CMMSRequest } from "../../types/interfaces";
import MultiSelect from "react-native-multiple-select";
import { set } from "react-native-reanimated";
import SelectPicker from "../SelectPicker";
import Loading from "../Loading";

const FormGroup = ({
  action,
  id,
  user,
  type = '',
  plant,
  asset,
  formState,
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
  onNameChange,
  setFormState
}) => {

  const [formData, setFormData] = useState({
    guest_name: "",
    requestTypeID: 1,
    faultTypeID: 0,
    faultDescription: "",
    plantLocationID: plant || 0,
    taggedAssetID: asset || 0,
    priorityID: "",
    assignUserID: "",
    completionImage: [],
    completionComment: "",
    rejectionComment: "",
    images: []
  });

  const [errors, setErrors] = useState<object>({});
  const [hasError, setHasError] = useState<boolean>(false);
  const [reqItems, setReqItems] = useState<CMMSRequest>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRequest = async () => {
    setLoading(true);
    if(id) {

      await instance.get(`/api/request/${id}`)
      .then((res)=> {
        setReqItems(res.data);
        setFormState({
          requestTypeID: res.data.req_id || 0,
          faultTypeID: res.data.fault_id || 0,
          description: res.data.description || "",
          plantLocationID: res.data.plant_id || 0,
          taggedAssetID: res.data.psa_id || 0,
          image: null

        });
        setLoading(false);
      })
      .catch((err) => {
          console.log(err)
      });

    } else {
      setReqItems(requestItems);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequest();
  }, []);

  let selectedValue;

  const isCreateAction = action === 'create';
  const isAssignAction = action === 'assign';
  const isCompleteAction = action === 'complete';
  const isManageAction = action === 'manage';

  const isCorrectiveType = type === 'corrective';
  const isGuestType = type === 'guest';

  const hasPlant = Boolean(plant);
  const hasAsset = Boolean(asset);

  const data = [
    {
      id: 0,
      required: true,
      requiredMessage: "Reporter Name is required",
      name: "guest_name",
      type: "textarea",
      label: "Reporter Name",
      placeholder: "Reporter Name",
      accessibilityLabel: "Reporter Name",
      onChangeText: onNameChange,
      show: isCreateAction && isGuestType && !user
    },
    {
      id: 1, 
      required: true,
      requiredMessage: "Request Type is required",
      type:"radio", 
      label: "Request Type", 
      accessibilityLabel: "Pick a type", 
      name:"requestTypeID", 
      defaultValue: ['guest', 'corrective'].includes(type) ? 3 : 1, 
      onChange: onRequestTypeChange, 
      value: (reqItems?.req_id ?? ''), 
      items: requestTypes, 
      itemsConfig: { key: "req_id", value: "req_id", label: "request", 
      isDisabled: (!isCreateAction || (isCreateAction && isGuestType)) ?? false},
      selectedValueCond: (!isCreateAction && { value: reqItems?.req_id ?? ''}),
      show: true
    },
    {
      id: 2, 
      required: true,
      requiredMessage: "Fault Type is required",
      type: "select", 
      label: "Fault Type", 
      accessibilityLabel: "Fault Type", 
      name: "faultTypeID",
      placeholder: "Choose Fault Type", 
      onValueChange: onFaultTypeChange, 
      isDisabled: !isCreateAction ?? false, 
      items: faultTypes,
      itemsConfig: { key: "fault_id", value: "fault_id", label: "fault_type"},
      //((action !== 'create' || (action === 'create' && type === 'corrective')) && { selectedValue: formState.faultTypeID ? formState.faultTypeID : (reqItems?.fault_id ?? '') }),
      selectedValueCond: (()=> {
        if ((!isCreateAction || (isCreateAction && isCorrectiveType)) && formState.faultTypeID) {
          selectedValue = formState.faultTypeID || reqItems?.fault_id || '';
        } else {
          selectedValue = null;
        }

        return {selectedValue }
      })(),
      show: true
    },
    {
      id: 3,
      required: false,
      requiredMessage: "",
      type: "textarea",
      label: "Fault Description",
      placeholder: "Fault Description",
      accessibilityLabel: "Fault Description",
      name: "faultDescription",
      //(action !== 'create' || (action === 'create' && type === 'corrective')) && (action === 'create' && type ==='corrective' ? `[Corrective Request] ${reqItems?.fault_description ?? ''}` : (reqItems?.fault_description ?? '')),
      defaultValue: (()=> {
        let defaultValue;

        if ((isCreateAction || isCorrectiveType) && isCreateAction && isCorrectiveType) {
          defaultValue = `[Corrective Request] ${reqItems?.fault_description || ''}`;
        } else {
          defaultValue = reqItems?.fault_description || '';
        }

        return defaultValue;
      })(),
      onChangeText: onFaultDescriptionChange,
      isDisabled: action !== "create" ?? false,
      isReadOnly: action !== "create" ?? false,
      valueCond: (action !== 'create' && { value: reqItems?.fault_description }),
      show: true
    },
    {
      id: 4, 
      required: true,
      requiredMessage: "Plant Location is required",
      type: "select", 
      label: "Plant Location",
      accessibilityLabel: "Plant Location",
      name: "plantLocationID",
      placeholder: "Choose Plant Location", 
      onValueChange: onPlantLocationChange, 
      isDisabled: (!isCreateAction || (isCreateAction && isGuestType)) ?? false,
      items: plants,
      itemsConfig: { key: "plant_id", value: "plant_id", label: "plant_name"},
      //((action !== 'create' || (action === 'create' && plant) || (action === 'create' && type==='corrective')) && { selectedValue: formState.plantLocationID ? formState.plantLocationID : (plant ? plant : (reqItems?.plant_id || ''))}),
      selectedValueCond: (() => {

        if ( (!isCreateAction || (isCreateAction && (hasPlant || isCorrectiveType))) && formState.plantLocationID) {
          selectedValue = formState.plantLocationID || plant || reqItems?.plant_id || '';
        } else {
          selectedValue = null;
        }

        return { selectedValue };
      })(),
      show: true
    },
    {
      id: 5,
      required: true,
      requiredMessage: "Asset Tag is required",
      type: "select",
      label: "Asset Tag",
      accessibilityLabel: "Asset Tag",
      name: "taggedAssetID",
      placeholder: "Choose Asset Tag",
      onValueChange: onAssetTagChange,
      isDisabled: (!isCreateAction || (isCreateAction && isGuestType)) ?? false,
      items: assetTags,
      itemsConfig: { key: "psa_id", value: "psa_id", label: "asset_name" },
      selectedValueCond: (() => {
      //((action !== 'create' || (action === 'create' && asset) || (action === 'create' && type === 'corrective')) && { selectedValue: formState.taggedAssetID ? formState.taggedAssetID : (asset ? asset : (reqItems?.psa_id || ''))}),
      if ((!isCreateAction || (isCreateAction && (hasAsset || isCorrectiveType)))) {
        selectedValue = formState.taggedAssetID || asset || reqItems?.psa_id || '';
      } else {
        selectedValue = null;
      }

      return { selectedValue };
      })(),
      show: true
    },
    {
      id: 6,
      required: false,
      requiredMessage: "Image is required",
      type: "image",
      label: "Image",
      accessibilityLabel: "Image",
      name: "image",
      defaultValue: reqItems?.image || '',
      onPress: onImagePicker,
      isDisabled: !isCreateAction ?? false,
      value: reqItems?.image || '',
      imageSource: !isCreateAction || imageSource,
      addImage: isCreateAction,
      bufferData: reqItems?.uploaded_file?.data,
      show: true
    },
    {
      id: 8,
      required: true,
      requiredMessage: "Assign To is required",
      type: "select",
      label: "Assign To",
      accessibilityLabel: "Assign To",
      placeholder: "Choose Assign To",
      name: "assignUserID",
      onValueChange: onAssignUserChange,
      items: assignUsers,
      itemsConfig: { key: "id", value: "id", label: "name,email" },
      selectedValueCond: { selectedValue: assignUserSelected?.value ?? reqItems?.assigned_user_id },
      show: isAssignAction
    },
    {
      id: 9,
      required: true,
      type: "select",
      label: "Priority",
      accessibilityLabel: "Priority",
      name: "priorityID",
      placeholder: "Choose Priority",
      onValueChange: onPriorityChange,
      items: priorities,
      itemsConfig: { key: "p_id", value: "p_id", label: "priority" },
      selectedValueCond: {selectedValue: prioritySelected?.p_id ?? reqItems?.priority_id},
      show: isAssignAction
    },
    {
      id: 10,
      required: true,
      requiredMessage: "Completion image is required",
      type: "image",
      label: "Completion Image",
      name: "completionImage",
      onPress: onCompletionImagePicker,
      imageSource: completionImageSource,
      bufferData: reqItems?.completion_file?.data,
      addImage: isCompleteAction,
      isDisabled: false,
      show: ['complete','manage'].includes(action)
    },
    {
      id: 11,
      required: false,
      type: "textarea",
      label: "Completion Comment",
      name: "completionComment",
      placeholder: "Completion Comment",
      defaultValue: reqItems?.complete_comments || '',
      onChangeText: onCompletionCommentChange,
      isDisabled: isManageAction,
      isReadOnly: isManageAction,
      valueCond: (!isCompleteAction && { value: reqItems?.complete_comments || 'NIL'}),
      show: ['complete','manage'].includes(action)
    },
    {
      id: 12,
      required: false,
      type: "textarea",
      label: "Comments",
      name: "rejectionComment",
      placeholder: "Comments",
      onChangeText: onRejectionCommentChange,
      show: action === 'manage'
    },
    {
      id: 13,
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
      show: isManageAction
    },
    {
      id: 14,
      type: "button",
      label: "Submit",
      bgColor: "#C8102E",
      show: !isManageAction,
      onPress: onSubmit
    }

  ]

  const validate = () => {
    let hasError = 0;
    setErrors({});
    setHasError(false);

    for(const i in data) {
      const { type, name, required, requiredMessage, show, imageSource } = data[i];

      if(type==='image') {

        if (show && required && isEmpty(imageSource)) {
          setErrors(prevErrors=> ({ 
            ...prevErrors,
            [name]: requiredMessage
          }));
          //return false;
          hasError++;
        }

      } else {

        if (show && required && (isEmpty(formData[name]) || formData[name] === '0' )) {
          setErrors(prevErrors=>({ 
            ...prevErrors,
            [name]: requiredMessage
          }));
          //return false;
          hasError++;
        }

      }

    }

    if(hasError>0) {
      setHasError(true);
      return false;
    }

    return true;
  };

  const handleSubmit = (onSubmit) => {
    validate() ? onSubmit() : console.log('Validation Failed');
  };

  const handleChange = (name, value, action) => {
    console.log('value change', name, value)
    setFormData(prevState => ({ ...prevState, [name]: value }));
    action;
  }

  const handleDropDownChange = (name, value, action) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
    setSelectedItems(value);
    action;
  }

  return (
    <View style={{ flex: 1}}>
    {loading && <Loading/>}
    {!loading && <FlatList
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
          isReadOnly,
          onChangeText,
          selectedValueCond,
          bufferData,
          onPress,
          show = true,
          valueCond,
          bgColor,
          required,
          requiredMessage,
          imageSource,
          addImage
        } = item.item;
      
        switch(type) {
          case "radio":
            return ( 
              <FormControl isRequired={required} isInvalid={name in errors}>
                <FormControl.Label>{label}</FormControl.Label>
                <Radio.Group
                  name={name}
                  defaultValue={defaultValue}
                  accessibilityLabel={accessibilityLabel}
                  onChange={(value) => handleChange(name, value, onChange(value))}
                  {...(action !== 'create' && { value: value})}
                  >

                  <HStack flex={1} justifyContent="space-between" w="100%" flexWrap={'wrap'}>
                    {items?.map((item) => (
                      <Radio key={item[itemsConfig.key]} value={item[itemsConfig.value]} colorScheme="red" size="sm" my={1} isDisabled={itemsConfig.isDisabled}>{item[itemsConfig.label]}</Radio>
                    ))}

                  </HStack>
                </Radio.Group>
                {name in errors && <FormControl.ErrorMessage>{requiredMessage}</FormControl.ErrorMessage>}
              </FormControl>
            );
            break;

          case "select":
            const options = items?.map((item) => {
              const value = item[itemsConfig.value];
              let label = item[itemsConfig.label];

              if (itemsConfig.label.includes(',')) {
                const labels = itemsConfig.label.split(',');
                label = `${item[labels[0]]} | ${item[labels[1]]}`;
              }

              return {
                value,
                label,
              };
            });

            return ( 
              <>
              { show && 
                <FormControl isRequired={required} isInvalid={name in errors}>
                  <FormControl.Label>{ label }</FormControl.Label>
                  <SelectPicker 
                    items={options} 
                    placeholder={placeholder} 
                    multiple={false}
                    {...selectedValueCond}
                    disabled={isDisabled}
                    onValueChange={(value) => handleChange(name, value, onValueChange(value))} />
                  {name in errors && <FormControl.ErrorMessage>{requiredMessage}</FormControl.ErrorMessage>}
                </FormControl>
              }
              </>
            );
            break;

        case "textarea":
          return (
            <>
            { show &&
            <FormControl isRequired={required} isInvalid={name in errors}>
              <FormControl.Label>{label}</FormControl.Label>
              <TextArea 
                placeholder={placeholder}
                autoCompleteType={true} 
                onChangeText={(value) => handleChange(name, value, onChangeText(value))} 
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
                _disabled={{
                  bg: "muted.100",
                }}
                defaultValue={defaultValue}
                {...valueCond}
                />
                {name in errors && <FormControl.ErrorMessage>{requiredMessage}</FormControl.ErrorMessage>}
            </FormControl>
            }
            </>
          );
          break;

        case "image":
          return (
            <>
            { show && <FormControl isRequired={required} isInvalid={name in errors}>
              <FormControl.Label>{label}</FormControl.Label>
              { bufferData 
                ? <ImageComponent bufferData={bufferData}/> 
                : <ImagePreview source={{ uri: imageSource }} alt="test" onPress={onPress} addImage={addImage} isDisabled={isDisabled}/>
              }
              {name in errors && <FormControl.ErrorMessage>{requiredMessage}</FormControl.ErrorMessage>}
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
                <Button bgColor={items[0].bgColor} mr={5} mt={5} mb={20} onPress={items[0].onPress}>{ items[0].label }</Button>
                <Button bgColor={items[1].bgColor} ml={5} mt={5} mb={20} onPress={items[1].onPress}>{ items[1].label }</Button>
              </HStack>
            }
            </>
          );

          break;

        case "button":
          return (
            <>
            { show && 
              <>
              { hasError && <Text color={"rgb(220, 38, 38)"} fontSize={12} mt={3}>Please fill in all required fields</Text> }
              <Button bgColor={bgColor} mt={5} mb={20} onPress={()=>handleSubmit(onPress)}>{ label }</Button>
              </>
            }
            </>
          );
          break;

        }

      }
      }
    />
    }
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

    </View>

  )

}

export default FormGroup;