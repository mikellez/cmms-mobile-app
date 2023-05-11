import CheckType from "../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Checkbox } from "native-base";
import { ModuleCardContainer } from "../../ModuleLayout";
import { Text, FlatList } from "react-native"; 
import { Dispatch, SetStateAction, ReactNode, useContext } from "react";
import { updateSpecificCheck } from "../ChecklistFillableForm";
import { ChecklistEditableFormContext } from "../../../context/checklistContext";


class MultiChoiceType extends CheckType {
    choices: string[];

    constructor(question?: string, value?: string, choices?: string[]) {
		super(question, value);
        this.choices = choices ? choices : [];
	};

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            choices: this.choices,
            type: "MultiChoice", 
        } 
    }

    renderCreatorForm(deleteCheck: Function, setChecks: Dispatch<SetStateAction<CheckType[]>>): ReactNode {
        return (
            <MultiChoiceCreatorForm 
                deleteCheck={deleteCheck}
                setChecks={setChecks}
                check={this} 
            />
        );
    };

    renderEditableForm(sectionId: string, rowId: string) {
        return <MultiChoiceEditableForm check={this} sectionId={sectionId} rowId={rowId}/>
    }
};


const MultiChoiceCreatorForm = ({ deleteCheck, check, setChecks }: {
    deleteCheck: Function,
    check: MultiChoiceType,
    setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>
}) => {

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Input 
                        w="80%"
                        my={2}
                        placeholder="Question"
                        onChangeText={(text: string) => CheckType.handleTextChange(text, check.getId(), setChecks)}
                        defaultValue={check.question}
                    />
                    <IconButton
                        marginLeft="auto"
                        _icon={{
                            as: MaterialCommunityIcons,
                            name: "delete-outline"
                        }}
                        colorScheme="white"
                        onPress={() => deleteCheck(check.getId())}
                    />
                </HStack>
                <FlatList
                    data={check.choices}
                    keyExtractor={ch => ch}
                    renderItem={({item}) => {
                        return <Checkbox value={item} size="sm" isDisabled>
                            {item}
                        </Checkbox>
                    }}/>
            </VStack>
        </ModuleCardContainer>
    );
};

const MultiChoiceEditableForm = ({check, sectionId, rowId}: {
    check: MultiChoiceType,
    sectionId: string,
    rowId: string,
}) => {
    
    const { setSections, isDisabled } = useContext(ChecklistEditableFormContext);
    const handleChange = (value: string, isSelected: boolean) => {
        if (isSelected) {
            if (check.value.trim().length > 0) {
                updateSpecificCheck(sectionId, rowId, check.getId(), check.value + "," + value, setSections); 
            } else {
                updateSpecificCheck(sectionId, rowId, check.getId(), value, setSections);
            }
            
        } else {
            const newValues = [...values].filter(v => v != value);
            updateSpecificCheck(sectionId, rowId, check.getId(), newValues.join(","), setSections);
        }
    }

    const values = check.value.split(",");

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Text>
                        {check.question}
                    </Text>
                </HStack>
                <FlatList
                    data={check.choices}
                    keyExtractor={ch => ch}
                    renderItem={({item}) => {
                        return (
                            <Checkbox 
                                value={item} 
                                size="sm" 
                                isDisabled={isDisabled}
                                onChange={(isSelected) => handleChange(item, isSelected)}
                                isChecked={values.includes(item)}
                            >
                                {item}
                            </Checkbox>
                        )
                    }}
                />
            </VStack>
        </ModuleCardContainer>
    )
}

export { MultiChoiceType }