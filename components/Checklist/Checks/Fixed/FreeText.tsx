import CheckType from "../../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import { ModuleCardContainer } from "../../../ModuleLayout";
import { Text } from "react-native";
import { color } from "native-base/lib/typescript/theme/styled-system";

class FreeTextType extends CheckType {
    constructor(question?: string, value?: string) {
        super(question, value);
    }

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            type: "FreeText",
        };
    }

    renderCreatorForm(
        deleteCheck: Function,
        setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>
    ) {
        return (
            <FreeTextCreatorForm check={this} deleteCheck={deleteCheck} setChecks={setChecks} />
        );
    }

    renderEditableForm(isDisabled: boolean) {
        <FreeTextEditableForm check={this} isDisabled={isDisabled}/>
    }
}

const FreeTextCreatorForm = ({
    deleteCheck,
    check,
    setChecks,
}: {
    deleteCheck: Function;
    check: FreeTextType;
    setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>;
}) => {
    return (
        <ModuleCardContainer>
            <VStack >
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
                <Input w="80%" my={2} isDisabled={true} _disabled={{ backgroundColor: "grey" }} />
            </VStack>
        </ModuleCardContainer>
    );
};

const FreeTextEditableForm = ({check, isDisabled}) => {
    return (
        <ModuleCardContainer>
            <VStack >
                <HStack>
                    <Text>
                        {check.question}
                    </Text>
                </HStack>
                <Input w="80%" my={2} isDisabled={isDisabled} _disabled={{ backgroundColor: "grey" }} />
            </VStack>
        </ModuleCardContainer>
    );
}

export { FreeTextType };
