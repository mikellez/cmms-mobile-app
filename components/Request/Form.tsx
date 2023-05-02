import { FormControl, HStack, Radio, Select, CheckIcon, TextArea, Pressable, Button, Box, Text } from "native-base";
import ImagePreview from "../ImagePreview";
import ImageComponent from "../../components/Image";

const Form = ({
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
  onSubmit
}) => {
  return (
    <>
    <FormControl isRequired>
      <FormControl.Label>Request Type</FormControl.Label>
      <Radio.Group
        name="request_type"
        defaultValue="1"
        accessibilityLabel="pick a size"
        onChange={onRequestTypeChange}
        value={requestItems?.req_id || ''} >

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
          selectedValue={requestItems?.fault_id || ''}
          >

          {faultTypes.map((faultType) => (
            <Select.Item key={faultType.fault_id} label={faultType.fault_type} value={faultType.fault_id} />
          ))}

        </Select>
      </FormControl>

      <FormControl isRequired>
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
          value={action !== "create" ? requestItems?.description || 'NIL' : ''}
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
          isDisabled={action !== "create" ?? false}
          selectedValue={plant ? plant : (requestItems?.plant_id || '')}
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
          isDisabled={action !== "create" ?? false}
          selectedValue={asset ? asset : (requestItems?.psa_id || '')}
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

      { action === "complete" &&
        <FormControl isRequired>
          <FormControl.Label>Completion Image</FormControl.Label>
            <Pressable onPress={onCompletionImagePicker}>
              <ImagePreview source={{ uri: completionImageSource }} alt="test" />
            </Pressable>
        </FormControl>
      }

      { action === "complete" &&
      <FormControl isRequired>
        <FormControl.Label>Completion Comments</FormControl.Label>
        <TextArea 
          placeholder="Completion Comments" 
          autoCompleteType={true} 
          onChangeText={onCompletionCommentChange} 
          />
      </FormControl>
      }
      
      <Button bgColor="#C8102E" mt={5} mb={10} onPress={onSubmit}>Submit</Button>

    </>

  )

}

export default Form;