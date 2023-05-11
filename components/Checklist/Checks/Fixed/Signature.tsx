import CheckType from "../../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import { ModuleCardContainer } from "../../../ModuleLayout";
import { TextInput } from "react-native";
import { color } from "native-base/lib/typescript/theme/styled-system";

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
            <SingleChoiceCreatorForm check={this} deleteCheck={deleteCheck} setChecks={setChecks} />
        );
    }

    renderEditableForm() {

    }
}

const SingleChoiceCreatorForm = ({
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
                    <Input
                        w="80%"
                        my={2}
                        placeholder="Question"
                        defaultValue={check.question}
                        onChangeText={(text: string) =>
                            CheckType.handleTextChange(text, check.getId(), setChecks)
                        }
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
                {/* add a signature component here */}
            </VStack>
        </ModuleCardContainer>
    );
};


export { SignatureType };
