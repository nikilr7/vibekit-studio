import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Heading, VStack, Text } from "@chakra-ui/react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container maxW="md" py={20}>
      <VStack gap={6}>
        <Heading size="lg">Welcome to Dashboard</Heading>
        <Box textAlign="center">
          <Text fontSize="md" mb={4}>
            You are successfully logged in!
          </Text>
          <Text fontSize="sm" color="gray.500">
            This is your dashboard page.
          </Text>
        </Box>
        <Button colorScheme="red" onClick={handleLogout} width="full">
          Logout
        </Button>
      </VStack>
    </Container>
  );
}
