import CheckType from "../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IconButton, HStack, VStack, TextArea, Button, ScrollView } from "native-base";
import { ModuleCardContainer } from "../../ModuleLayout";
import { TouchableOpacity, Text, View, StyleSheet, Modal, Image} from "react-native";
import { useRef , useState, useContext} from "react";
import SignatureScreen, {SignatureViewRef} from "react-native-signature-canvas";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { ChecklistEditableFormContext } from "../../../context/checklistContext";
import { updateSpecificCheck } from "../ChecklistFillableForm";



class SignatureType extends CheckType {
    constructor(question?: string, value?: string) {
        super(question, value, "Signature");
    }

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            type: this.type,
        };
    }

    renderCreatorForm(
        deleteCheck: Function,
        setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>
    ) {
        return (
            <SignatureCreatorForm check={this} deleteCheck={deleteCheck} setChecks={setChecks} />
        );
    }

    renderEditableForm(sectionId: string, rowId: string) {
        return <SignatureEditableForm check={this} sectionId={sectionId} rowId={rowId}/>
    }
}

const Sign = ({text, onOK}) => {
    const [ show, setShow ] = useState(false);
    const ref = useRef<SignatureViewRef>();
    const showSignature = () => setShow(true);
    const closeSignature = () => setShow(false);
    
  
    const handleSignature = signature => {
      onOK(signature);
      setShow(false);
    };
  
    const handleEmpty = () => {
      console.log('Empty');
    }
  
    const handleClear = () => {
      console.log('clear success!');
    }
  
    const handleEnd = () => {
        console.log('end success!');
    }
  
    const handleBegin = () => {
      console.log('begin!');
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{}} onPress={showSignature}>
            <HStack alignItems={"center"}>
                <Text>Sign here</Text>
                <Button onPress={showSignature} style={{marginHorizontal: 20}} bg="#C8102E">
                    <FontAwesome5 name="signature" size={24} color="white" />
                </Button>
            </HStack>
        </TouchableOpacity>

        <Modal visible={show}
            onRequestClose={() => setShow(false)}
            transparent={true}
            style={{height: "50%", borderWidth: 10}}>
            <TouchableOpacity onPress={closeSignature} 
            style={{alignItems: "flex-end", backgroundColor: "#C8102E"}}>
                <Entypo size={34} name="cross"></Entypo>
            </TouchableOpacity>
            <SignatureScreen
                ref={ref}
                onEnd={handleEnd}
                onOK={handleSignature} 
                onEmpty={handleEmpty}
                onClear={handleClear}
                onBegin={handleBegin}
                autoClear={true} 
                descriptionText={text}
                backgroundColor="rgb(255,255,255)"
                style={{height: 100}}
                webStyle={`.m-signature-pad--footer
                    .button {
                        background-color: #C8102E;
                        color: #FFF;
                    }`}
            />
        </Modal>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: "100%",
      height: "50%"
    },
    // signature: {
    //     marginHorizontal:
    // }
  });

const SignatureCreatorForm = ({
    deleteCheck,
    check,
    setChecks,
}: {
    deleteCheck: Function;
    check: SignatureType;
    setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>;
}) => {

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Text>Sign here</Text>
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
                <TextArea 
                    h={20} placeholder="" 
                    numberOfLines={4} 
                    autoCompleteType={true} 
                    isDisabled
                    _disabled={{ borderColor: "black",
                                borderWidth: "1px" ,
                                borderStyle: "dashed"}}
                />
            </VStack>
        </ModuleCardContainer>
    );
};

const SignatureEditableForm = ({check, sectionId, rowId}: {
    check: SignatureType,
    sectionId: string,
    rowId: string,
}) => {
    const { setSections, isDisabled, sectionsRef } = useContext(ChecklistEditableFormContext);
    const [finalSignature, setSignature] = useState("");
    

    const onOK = (signature) => {
        // setSignature(signature);
        updateSpecificCheck(sectionId, rowId, check.getId(), signature, setSections, sectionsRef);
        setSections(); // This is to force a re-render
    }

    return (
        <ModuleCardContainer>
            { isDisabled ?  
            <>
            <Text>Signature</Text>
            <Text> </Text>
            <View style={{  width: "100%", 
                            height: 250, 
                            borderColor: "grey",
                            borderWidth: 3,
                            borderStyle: "dashed",
                            marginTop: 10,
                            marginBottom: 15}}>
                <Image style={{width: "100%", height: "100%"}} 
                        source={{uri: check.value ? check.value : null}}/>
            </View>
            </>
            : <>
            <Sign text="Sign above" onOK={onOK}></Sign>
            <View style={{  width: "100%", 
                            height: 200, 
                            borderColor: "grey",
                            borderWidth: 3,
                            borderStyle: "dashed",
                            marginTop: 10,
                            marginBottom: 15}}>
                <Image style= {{ 
                            width: "100%", 
                            height: "100%", 
                        }}
                    source={{uri: check.value ? check.value : null}}/>
            </View>
        </>}
        </ModuleCardContainer>
    );
}

export { SignatureType };
