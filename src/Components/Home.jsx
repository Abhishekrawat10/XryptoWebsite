import { Box, Image, Text } from "@chakra-ui/react";
import btc from  '../assets/btc.png'

const Home = () => {
  return <Box h={"87vh"} bgColor={"blackAlpha.900"}>
    <Image w={"full"} h={"full"} objectFit={"contain"} src={btc} />
    <Text fontSize={"6xl"} textAlign={"center"} fontWeight={"thin"} mt={"-20"} color={"whiteAlpha.700"}>Xrypto</Text>
  </Box>
};

export default Home;
