import { useContext } from "react";
import CheckType from "../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import {FlatList, Text} from "react-native";
import { ModuleCardContainer } from "../../ModuleLayout";
import { updateSpecificCheck } from "../ChecklistFillableForm";
import { ChecklistEditableFormContext } from "../../../context/checklistContext";


class SingleChoiceType extends CheckType {

    choices: string[];

    constructor(question?: string, value?: string, choices?: string[]) {
		super(question, value, "SingleChoice");
        this.choices = choices ? choices : [];
	};
    
    

    toJSON() {
        return {
            question: this.question,
            value: this.value,
            choices: this.choices,
            type: this.type,
        }
    };

    renderCreatorForm(deleteCheck: Function, setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>) {
        return (
            <SingleChoiceCreatorForm 
                check={this}
                deleteCheck={deleteCheck}
                setChecks={setChecks}
            />
        )
    };

    renderEditableForm(sectionId: string, rowId: string) {
        return <SingleChoiceEditableForm check={this} sectionId={sectionId} rowId={rowId}/>;
    }
};

const SingleChoiceCreatorForm = ({ deleteCheck, check, setChecks }: {
    deleteCheck: Function,
    check: SingleChoiceType,
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
                        defaultValue={check.question}
                        onChangeText={(text: string) => CheckType.handleTextChange(text, check.getId(), setChecks)}
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
                <Radio.Group name="SingleChoice">
                    <FlatList
                        data={check.choices}
                        keyExtractor={ch => ch}
                        renderItem={({item}) => {
                            return <Radio value={item} size="sm" isDisabled>
                                {item}
                            </Radio>
                        }}/>
                </Radio.Group>
            </VStack>
        </ModuleCardContainer>
    );
};

const SingleChoiceEditableForm = ({check, sectionId, rowId}: {
    check: SingleChoiceType,
    sectionId: string,
    rowId: string,
}) => {

    const { setSections, isDisabled, sectionsRef } = useContext(ChecklistEditableFormContext);
    const handleChange = (value: string) => {
        updateSpecificCheck(sectionId, rowId, check.getId(), value, setSections, sectionsRef);
    };
    
    return <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Text>
                        {check.question}
                    </Text>
                </HStack>
                <Radio.Group 
                    name="SingleChoice"
                    onChange={handleChange}
                    {...(check.value !== '' && { value: check.value }) }
                >
                    <FlatList
                    data={check.choices}
                    keyExtractor={ch => ch}
                    renderItem={({item}) => {
                        return <Radio value={item} size="sm" isDisabled={isDisabled}>
                            {item}
                        </Radio>
                    }}/>
                </Radio.Group>
            </VStack>
    </ModuleCardContainer>
}

export { SingleChoiceType };



