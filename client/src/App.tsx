import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Text, Heading } from "@chakra-ui/react";

function Landing() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/.netlify/functions/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <Box p={4}>
      <Text>{message}</Text>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Heading>Login</Heading>} />
        <Route path="/app" element={<Heading>Dashboard</Heading>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;