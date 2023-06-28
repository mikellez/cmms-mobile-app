import CheckType from "../classes/CheckType";
import { Dispatch, ReactNode, SetStateAction, useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio, TextArea, Pressable } from "native-base";
import { ModuleCardContainer } from "../../ModuleLayout";
import { Text } from "react-native";
import { updateSpecificCheck } from "../ChecklistFillableForm";
import { ChecklistEditableFormContext } from "../../../context/checklistContext";
import ImagePreview from "../../ImagePreview";
import * as ImagePicker from 'expo-image-picker';
import mime from "mime";
import * as FileSystem from 'expo-file-system';


class FileUploadType extends CheckType {
    constructor(question?: string, value?: string) {
        super(question, value, "FileUpload");
    };

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            type: this.type
        };
    };

    renderCreatorForm(deleteCheck: Function, setChecks: Dispatch<SetStateAction<CheckType[]>>): ReactNode {
        return (
            <FileUploadCreatorForm 
                deleteCheck={deleteCheck}
                setChecks={setChecks}
                check={this}
            />
        )
    };

    renderEditableForm(sectionId: string, rowId: string): ReactNode {
        return (
            <FileUploadEditableForm 
                sectionId={sectionId}
                rowId={rowId}
                check={this}
            />
        )
    };
};

const FileUploadCreatorForm = ({deleteCheck, check, setChecks}: {
    deleteCheck: Function,
    check: FileUploadType,
    setChecks: React.Dispatch<SetStateAction<CheckType[]>>
}) => {
    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Input
                        w="80%"
                        my={2}
                        placeholder="Question"
                        onChangeText={(text: string) =>
                            CheckType.handleTextChange(text, check.getId(), setChecks)
                        }
                        defaultValue={check.question}
                    />
                    <IconButton
                        marginLeft="auto"
                        _icon={{
                            as: MaterialCommunityIcons,
                            name: "delete-outline",
                        }}
                        colorScheme="white"
                        onPress={() => deleteCheck(check.getId())}
                    />
                </HStack>
                <ImagePreview source={{uri: ""}} alt="" addImage={true} />
            </VStack>
        </ModuleCardContainer>
    )
};

const FileUploadEditableForm = ({check, sectionId, rowId}: {
    check: FileUploadType,
    sectionId: string,
    rowId: string,
}) => {
    const { setSections, isDisabled, sectionsRef } = useContext(ChecklistEditableFormContext);

    const handleImagePicker = async () => {
        const file = await NativeImagePicker();
    
        if(file) {
        //console.log(file)
            const base64Image = await convertImageToBase64(file);
            const value = 'data:image/png;base64,'+base64Image;
            //console.log('Base64 encoded image:', base64Image);

            updateSpecificCheck(sectionId, rowId, check.getId(), value, setSections, sectionsRef);
            setSections(prev=>prev+1); // This is to force a re-render
        }
    };

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Text>
                        {check.question}
                    </Text>
                </HStack>

                <ImagePreview source={{ uri: check.value }} alt="checklist image" addImage={true} onPress={handleImagePicker} isDisabled={isDisabled}/>

            </VStack>
        </ModuleCardContainer>
    );
};


const NativeImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if(result.canceled) return false;

    return result.assets[0].uri
}

const convertImageToBase64 = async (imageUri) => {
  try {
    const imageInfo = await FileSystem.getInfoAsync(imageUri);
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return imageBase64;
  } catch (error) {
    console.log('Image conversion error:', error);
    throw error;
  }
};



export { FileUploadType }