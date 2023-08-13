import { useEffect, useState } from "react";
import {
  Container,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { server } from "../main";
import Error from "./Error";

const Exchanges = () => {
  const spinnerProp = {
    thickness: "4px",
    speed: "0.65s",
    emptyColor: "gray.200",
    color: "blue.500",
    size: "xl",
    justifyContent: "center",
    marginTop: "40vh",
  };
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(`${server}/exchanges?per_page=50`);
        if (response.ok) {
          const data = await response.json();
          setExchanges(data);
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
    fetchExchanges();
  }, []);

  if (error) {
    return <Error message={"Error while fetching data .. "} number={232} />;
  }

  return (
    <Container maxW={"container.xl"}>
      <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
        {loading ? (
          <Spinner {...spinnerProp} />
        ) : (
          exchanges.map((e) => (
            <ExchangeCard
              key={e.id}
              name={e.name}
              img={e.image}
              rank={e.trust_score_rank}
              url={e.url}
            />
          ))
        )}
      </HStack>
    </Container>
  );
};

const ExchangeCard = ({ name, img, rank, url }) => (
  <a href={url} target="blank" >
    <VStack w={'40'}  _hover={{transform:"scale(1.2)"}} transition={'all .3s'} margin={'3'} shadow={'lg'} p={4}>
      <Image
        src={img}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
      <Heading size={"md"} noOfLines={1}>
        {rank}
      </Heading>
      <Text noOfLines={1}>{name}</Text>
    </VStack>
  </a>
);

export default Exchanges;
