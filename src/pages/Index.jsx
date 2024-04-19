import { useState, useEffect } from "react";
import { Box, Input, VStack, Heading, Text, Link, IconButton, useToast, Spinner, Container, Flex } from "@chakra-ui/react";
import { FaHeart, FaSearch } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?query=LLMs`);
      const data = await response.json();
      setStories(data.hits);
    } catch (error) {
      toast({
        title: "Error fetching stories",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?query=LLMs ${searchTerm}`);
      const data = await response.json();
      setStories(data.hits);
    } catch (error) {
      toast({
        title: "Error searching stories",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const addToFavorites = (story) => {
    if (!favorites.some((fav) => fav.objectID === story.objectID)) {
      setFavorites([...favorites, story]);
      toast({
        title: "Added to Favorites",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Already in Favorites",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl">
      <VStack spacing={4} align="stretch">
        <Box p={5}>
          <Heading mb={4}>Hacker News - LLM Stories</Heading>
          <Flex>
            <Input placeholder="Search stories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mr={2} />
            <IconButton icon={<FaSearch />} onClick={handleSearch} aria-label="Search stories" />
          </Flex>
        </Box>
        {loading ? (
          <Spinner />
        ) : (
          stories.map((story) => (
            <Box p={5} shadow="md" borderWidth="1px" key={story.objectID}>
              <Flex justify="space-between" align="center">
                <Box flex="1">
                  <Heading fontSize="xl">{story.title}</Heading>
                  <Text mt={4}>{story.author}</Text>
                  <Link href={story.url} isExternal color="teal.500">
                    Read more
                  </Link>
                </Box>
                <IconButton icon={<FaHeart />} onClick={() => addToFavorites(story)} aria-label="Add to favorites" colorScheme={favorites.some((fav) => fav.objectID === story.objectID) ? "red" : "gray"} />
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
