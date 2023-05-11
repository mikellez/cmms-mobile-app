import CheckType from "../../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import { ModuleCardContainer } from "../../../ModuleLayout";
import { TextInput, Text, Image, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { useRef , useState} from "react";
import SignatureScreen, {SignatureViewRef} from "react-native-signature-canvas";
import { ModuleFullPageModal } from "../../../ModuleLayout";
import { Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";



class SignatureType extends CheckType {
    constructor(question?: string, value?: string) {
        super(question, value);
    }

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            type: "Signature",
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

    renderEditableForm(sectionId: string, rowId: string, isDisabled?: boolean) {
        return <></>
    }
}

const Sign = ({text, onOK}) => {
    const [ show, setShow ] = useState(false);
    const ref = useRef<SignatureViewRef>();
    const showSignature = () => setShow(true);
    const closeSignature = () => setShow(false);
  
    const handleSignature = signature => {
      console.log(signature);
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
        // ref.current.readSignature();
    }
  
    const handleBegin = () => {
      console.log('begin!');
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{borderColor: "red", borderWidth: 3}} onPress={showSignature}>
            <Text>Signature</Text></TouchableOpacity>
        {show && <Modal>
            <TouchableOpacity onPress={closeSignature} style={{alignItems: "flex-end"}}><Entypo size={34} name="cross"></Entypo></TouchableOpacity>
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
                // penColor={"rgba(255,117,2,1)"}
            />
        </Modal>}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
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
    const handleOK = (signature) => {
        const path = FileSystem.cacheDirectory + "sign.png";
        FileSystem.writeAsStringAsync(
          path,
          signature.replace("data:image/png;base64,", ""),
          { encoding: FileSystem.EncodingType.Base64 }
        )
          .then(() => FileSystem.getInfoAsync(path))
          .then(console.log)
          .catch(console.error);
      };

    const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    {/* <Input
                        w="80%"
                        my={2}
                        placeholder="Question"
                        defaultValue={check.question}
                        onChangeText={(text: string) =>
                            CheckType.handleTextChange(text, check.getId(), setChecks)
                        }
                    /> */}
                    {<Sign text="Sign above" onOK={handleOK}></Sign>}
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
            </VStack>
        </ModuleCardContainer>
    );
};

export { SignatureType };
