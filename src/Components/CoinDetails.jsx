import {
  Badge,
  Box,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
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
    return <Error message={"Error while fetching data .. "} />
  }
  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Spinner {...spinnerProp} marginTop={"50%"} marginRight={"50%"} />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            ghgs
          </Box>
          {/* <Button></Button> */}
          <RadioGroup value={currency} onChange={setCurrency} p={"3"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>
          <VStack alignItems={"flex-start"} spacing={"4"} padding={"10"}>
            <Text alignSelf={"center"} fontSize={"large"} opacity={"0.3"}>
              Last Updated on{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
            <Image src={coin.image.large} w={16} h={16} />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencysymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>
            <Badge fontSize={"2xl"} bgColor={"blackAlpha.800"} color={"white"}>
              {`#${coin.market_cap_rank}`}
            </Badge>
            <CustomBar
              high={`${currencysymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencysymbol}${coin.market_data.low_24h[currency]}`}
            />
          </VStack>
        </>
      )}
    </Container>
  );
};

const CustomBar = ({ high, low }) => {
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge colorScheme={"red"}>{low}</Badge>
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge colorScheme={"green"}>{high}</Badge>
    </HStack>
  </VStack>
};

export default CoinDetails;
