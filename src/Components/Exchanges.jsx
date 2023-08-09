import { server } from "../main";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, HStack, VStack,Spinner,Image,Heading,Text,wrap} from "@chakra-ui/react";


const Exchanges = () => {
  const spinnerProp = {
    thickness: "4px",
    speed: "0.65s",
    emptyColor: "gray.200",
    color: "blue.500",
    size: "xl",
  };
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchExchanges = async () => {
      const { data } = await axios.get(`${server}/exchanges?per_page=250`);
      setExchanges(data);
      setLoading(false);
      console.log(data);
    };
    fetchExchanges();
  }, []);

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Spinner {...spinnerProp} marginLeft={"50%"} marginTop={"40vh"} />
      ) : (
        <>
          <HStack wrap={wrap} justifyContent={"space-evenly"}>
            {exchanges.map((e) => {
              <ExchangeCard
                key={e.id}
                name={e.name}
                img={e.image}
                rank={e.trust_score_rank}
                url={e.url}
              />
            })}
          </HStack>
        </>
      )}
    </Container>
  );
};
const ExchangeCard = ({ name, img, rank, url }) => {
  <a href={url} target={"blank"}>
    <VStack>
      <Image src={img} w={"10"} h={"10"} objectFit={"contain"} alt={"Exchange"}/>
      <Heading size={'md'} nofLines = {1}>
        {rank}
      </Heading>
      <Text noOfLines={1}>{name}</Text>
    </VStack>
  </a>
};

export default Exchanges;

