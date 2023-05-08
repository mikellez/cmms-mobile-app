import CheckType from "../classes/CheckType";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Box, Input, IconButton, HStack } from "native-base";

class SingleChoiceType extends CheckType {

    choices: string[];

    constructor(question?: string, value?: string, choices?: string[]) {
		super(question, value);
        this.choices = choices ? choices : [];
	};

    renderCreatorForm(deleteCheck: Function) {
        return (
            <SingleChoiceCreatorForm 
                check={this}
                deleteCheck={deleteCheck}
            />
        )
    };
};

const SingleChoiceCreatorForm = ({ deleteCheck, check }: {
    deleteCheck: Function,
    check: SingleChoiceType
}) => {
    return (
        <Box>
            <HStack>
                <Input 
                    w="80%"
                    placeholder="Question"
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
        </Box>
    );
};

export { SingleChoiceType };



