import {
  Box,
  Container,
  Image,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { server } from "../main";
import { useParams } from "react-router-dom";
import Error from "./Error";

const CoinDetails = () => {
  const spinnerProp = {
    thickness: "4px",
    speed: "0.65s",
    emptyColor: "gray.200",
    color: "blue.500",
    size: "xl",
    justifyContent: "center",
    marginTop: "40vh",
  };
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("eur");
  const currencysymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  const params = useParams();
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(`${server}/coins/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCoin(data);
          console.log(data);
        } else {
          console.error("Error fetching data:", res.statusText);
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [params.id]);
  if (error) {
    return <Error message={"Error while fetching data .. "} />;
  }
  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Spinner {...spinnerProp} marginTop={"50%"} marginRight={"50%"} />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            {coin.id}
          </Box>
          {/* <Button></Button> */}
          <RadioGroup value={currency} onChange={setCurrency}>
            <Stack spacing={4} direction="row">
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value="eur">EURO</Radio>
            </Stack>
          </RadioGroup>
          <VStack alignItems={"flex-start"} spacing={4} opacity={0.3}>
            <Text alignSelf={"center"} fontSize={'large'}>
              Last Updated on{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
            <Image src={coin.image.large} w={16} h={16} />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>{currencysymbol}{coin}</StatNumber>
            </Stat>
          </VStack>
        </>
      )}
    </Container>
  );
};

export default CoinDetails;
