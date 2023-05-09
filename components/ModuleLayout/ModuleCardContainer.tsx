import React from "react";
import { Box } from "native-base";

interface ModuleCardContainerProps extends React.PropsWithChildren {

};

const ModuleCardContainer = (props: ModuleCardContainerProps) => {
    return (
        <Box 
            px="2.5"
            py="2.5"
            rounded="md" 
            _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} 
            borderWidth={1} borderColor='#dee2e6'
            bg="white"
            // shadow="3"
        >{props.children}</Box>
    )
};

export { ModuleCardContainer }