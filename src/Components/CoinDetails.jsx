import {
  Badge,
  Box,
  Button,
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
import Chart from "./Chart";

const CoinDetails = () => {
  const spinnerProp = {
    thickness: "4px",
    speed: "0.65s",
    emptyColor: "gray.200",
    color: "blue.500",
    size: "xl",
    marginTop: "40vh",
  };
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const currencysymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  const params = useParams();
  const btns = ["24H", "7d", "14d", "30d", "60d", "200d", "365d", "max"];
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(`${server}/coins/${params.id}`);
        const chart = await fetch(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        if (res.ok && chart.ok) {
          const data = await res.json();
          setCoin(data);
          const chartdata = await chart.json();
          setChartArray(chartdata.prices);
          console.log(chartArray);
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
  }, [params.id, currency, days]);
  if (error) {
    return <Error message={"Error while fetching data .. "} />;
  }
  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading("true");
        break;
      case "7d":
        setDays("7d");
        setLoading("true");
        break;
      case "14d":
        setDays("14d");
        setLoading("true");
        break;
      case "30d":
        setDays("30d");
        setLoading("true");
        break;
      case "60d":
        setDays("60d");
        setLoading("true");
        break;
      case "200d":
        setDays("200d");
        setLoading("true");
        break;
      case "365d ":
        setDays("365d");
        setLoading("true");
        break;
      case "max":
        setDays("max");
        setLoading("true");
        break;

      default:
        setDays("1d");
        setLoading("true");
        break;
    }
  };
  return (
    <Container maxW={"container.xl"} bgColor={"blackAlpha.900"} color={"white"}>
      {loading ? (
        <VStack alignItems={"center"} justifyContent={"center"}>
          <Spinner {...spinnerProp} />
        </VStack>
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            <Chart currency={currencysymbol} arr={chartArray} days={days} />
          </Box>
          <HStack p={"4"} wrap={"wrap"}>
            {btns.map((i) => {
              return (
                <Button
                  key={i}
                  onClick={() => {
                    switchChartStats(i);
                  }}
                >
                  {i}
                </Button>
              );
            })}
          </HStack>
          <RadioGroup value={currency} onChange={setCurrency} p={"3"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>
          <VStack alignItems={"flex-start"} spacing={"4"} padding={"9"}>
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
            <VStack w={"full"}>
              <Progress value={50} colorScheme={"teal"} w={"full"} />
              <HStack justifyContent={"space-between"} w={"full"}>
                <Badge
                  colorScheme={"red"}
                  fontSize={"lg"}
                >{`${currencysymbol}${coin.market_data.low_24h[currency]}`}</Badge>
                <Text fontSize={"lg"}>24H Range</Text>
                <Badge
                  colorScheme={"green"}
                  fontSize={"lg"}
                >{`${currencysymbol}${coin.market_data.high_24h[currency]}`}</Badge>
              </HStack>
            </VStack>
            <Box w={"full"} p={4}>
              <Item
                title={"Max Supply"}
                value={coin.market_data.circulating_supply}
              />
              <Item
                title={"Market Cap"}
                value={`${currencysymbol}${coin.market_data.market_cap[currency]}`}
              />
              <Item
                title={"All Time Low"}
                value={`${currencysymbol}${coin.market_data.atl[currency]}`}
              />
              <Item
                title={"All Time Hight"}
                value={`${currencysymbol}${coin.market_data.ath[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => {
  return (
    <HStack justifyContent={"space-between"} w={"full"} my={4}>
      <Text letterSpacing={"widest"}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
  );
};

export default CoinDetails;
