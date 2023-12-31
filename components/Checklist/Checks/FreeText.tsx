import CheckType from "../classes/CheckType";
import { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio, TextArea } from "native-base";
import { ModuleCardContainer } from "../../ModuleLayout";
import { Text } from "react-native";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { updateSpecificCheck } from "../ChecklistFillableForm";
import { ChecklistEditableFormContext } from "../../../context/checklistContext";

class FreeTextType extends CheckType {
    constructor(question?: string, value?: string) {
        super(question, value, "FreeText");
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
            <FreeTextCreatorForm check={this} deleteCheck={deleteCheck} setChecks={setChecks} />
        );
    }

    renderEditableForm(sectionId: string, rowId: string) {
        return <FreeTextEditableForm check={this} sectionId={sectionId} rowId={rowId}/>
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
                <TextArea 
                    h={20} placeholder="" 
                    numberOfLines={4} 
                    autoCompleteType={true} 
                    isDisabled
                    _disabled={{ backgroundColor: "grey" }}
                />
            </VStack>
        </ModuleCardContainer>
    );
};

const FreeTextEditableForm = ({check, sectionId, rowId}: {
    check: FreeTextType,
    sectionId: string,
    rowId: string,
}) => {

    const { setSections, isDisabled, sectionsRef } = useContext(ChecklistEditableFormContext);
    const handleTextChange = (text: string) => {
        updateSpecificCheck(sectionId, rowId, check.getId(), text, setSections, sectionsRef);
    };

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Text>
                        {check.question}
                    </Text>
                </HStack>
                <TextArea 
                    h={20} placeholder="" 
                    numberOfLines={4} 
                    autoCompleteType={true} 
                    isDisabled={isDisabled} 
                    onChangeText={handleTextChange}
                    {...(check.value !== '' && { value: check.value }) }
                />
            </VStack>
        </ModuleCardContainer>
    );
}

export { FreeTextType };
