import { useContext } from "react";
import CheckType from "../../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import {FlatList, Text} from "react-native";
import { ModuleCardContainer } from "../../../ModuleLayout";
import { updateSpecificCheck } from "../../ChecklistFillableForm";
import { ChecklistEditableFormContext } from "../../../../pages/Checklist/CompleteChecklistPage";

class SingleChoiceType extends CheckType {

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
            type: "SingleChoice",
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

    renderEditableForm(sectionId: string, rowId: string, isDisabled?: boolean) {
        return <SingleChoiceEditableForm check={this} sectionId={sectionId} rowId={rowId} isDisabled={isDisabled}/>;
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

const SingleChoiceEditableForm = ({check, sectionId, rowId, isDisabled}: {
    check: SingleChoiceType,
    sectionId: string,
    rowId: string,
    isDisabled?: boolean
}) => {

    const { setSections } = useContext(ChecklistEditableFormContext);

    const handleChange = (value: string) => {
        updateSpecificCheck(sectionId, rowId, check.getId(), value, setSections);
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
                    value={check.value}
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



