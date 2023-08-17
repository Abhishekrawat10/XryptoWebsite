import { useEffect, useState } from "react";
import {
  Container,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Spinner,
  Button,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { server } from "../main";
import Error from "./Error";
import { Link } from "react-router-dom";

const Coins = () => {
  const spinnerProp = {
    thickness: "4px",
    speed: "0.65s",
    emptyColor: "gray.200",
    color: "blue.500",
    size: "xl",
  };
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");

  const currencysymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await fetch(
          `${server}/coins/markets?vs_currency=${currency}&per_page=100&page=${page}`
        );
        if (response.ok) {
          const data = await response.json();
          setCoins(data);
        } else {
          console.error("Error fetching data:", response.statusText);
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError(true);
      }
    };
    fetchCoin();
  }, [currency, page]);

  if (error) {
    return <Error message={"Error while fetching data .. "} />;
  }

  return (
    <Container maxW={"container.xl"} bgColor={"blackAlpha.900"} color={"white"}>
      {loading ? (
        <HStack justifyContent={"center"}>
          <Spinner {...spinnerProp} />
        </HStack>
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency}>
            <Stack spacing={4} direction="row">
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value="eur">EURO</Radio>
            </Stack>
          </RadioGroup>
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((e) => (
              <CoinCard
                key={e.id}
                id={e.id}
                name={e.name}
                img={e.image}
                currpice={e.current_price}
                currencySymbol={currencysymbol}
              />
            ))}
          </HStack>
        </>
      )}
      <HStack justifyContent={"Center"} bottom={"5"}>
        <Button
          bgColor={"blackAlpha.900"}
          color={"white"}
          onClick={() => {
            let pageNo = page;
            pageNo > 1 ? setPage(pageNo - 1) : alert("This is first Page");
            setLoading(true);
          }}
        >
          Previous
        </Button>
        <Button
          bgColor={"blackAlpha.900"}
          color={"white"}
          onClick={() => {
            let pageNo = page;
            pageNo === 8 ? setPage(1) : setPage(pageNo + 1);
          }}
        >
          Next
        </Button>
      </HStack>
    </Container>
  );
};

const CoinCard = ({key,id, name, img, currpice, currencySymbol = "₹" }) => (
  <Link to={`/coin/${id}`}>
    <VStack
      w={"40"}
      _hover={{ transform: "scale(1.2)" }}
      transition={"all .3s"}
      margin={"3"}
      shadow={"dark-lg"}
      p={4}
    >
      <Image
        src={img}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
      <Text noOfLines={1}>{name}</Text>
      <Heading size={"md"} noOfLines={1}>
        {`${currencySymbol} ${currpice}`}
      </Heading>
    </VStack>
  </Link>
);

export default Coins;
