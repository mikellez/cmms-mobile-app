import CheckType from "../../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Checkbox } from "native-base";
import { ModuleCardContainer } from "../../../ModuleLayout";
import { Text, FlatList } from "react-native"; 
import { Dispatch, SetStateAction, ReactNode } from "react";


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

    renderEditableForm(isDisabled?: boolean) {
        return <MultiChoiceEditableForm check={this} isDisabled={isDisabled}/>
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

const MultiChoiceEditableForm = ({check, isDisabled}) => {

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
                        return <Checkbox value={item} size="sm" isDisabled={isDisabled}>
                            {item}
                        </Checkbox>
                    }}/>
            </VStack>
        </ModuleCardContainer>
    )
}

export { MultiChoiceType }