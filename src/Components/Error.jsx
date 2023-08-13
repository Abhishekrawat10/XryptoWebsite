import { Alert, AlertIcon } from "@chakra-ui/react";

const Error = ({ message}) => {
  return <div><Alert status="error" position={"fixed"} bottom={'4'} left={'50%'} w={'container.lg'}>
    <AlertIcon/>
    {message}
  </Alert></div>;
};

export default Error;
