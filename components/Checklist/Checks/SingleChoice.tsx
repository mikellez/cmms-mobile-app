import CheckType from "../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack, VStack, Radio } from "native-base";
import { ModuleCardContainer } from "../../ModuleLayout";

class SingleChoiceType extends CheckType {

    choices: string[];

    constructor(question?: string, value?: string, choices?: string[]) {
		super(question, value);
        this.choices = choices ? choices : [];
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
};

const SingleChoiceCreatorFormChoice = ({choice}: {choice: string}) => {
    return (
        <Radio value={choice} size="sm" isDisabled>
            {choice}
        </Radio>
    );
};

const SingleChoiceCreatorForm = ({ deleteCheck, check, setChecks }: {
    deleteCheck: Function,
    check: SingleChoiceType,
    setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>
}) => {

    const choiceElements = check.choices.map((choice, index) => {
        return (
            <SingleChoiceCreatorFormChoice
                key={index}
                choice={choice}
            />
        );
    });

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack>
                    <Input 
                        w="80%"
                        my={2}
                        placeholder="Question"
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
                    {choiceElements}
                </Radio.Group>
            </VStack>
        </ModuleCardContainer>
    );
};

export { SingleChoiceType };



